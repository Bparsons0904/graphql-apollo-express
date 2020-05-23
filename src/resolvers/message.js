// Allow for authentication checks
import { combineResolvers } from "graphql-resolvers";
// Custom authentication methods
import { isAuthenticated, isMessageOwner } from "./authorization";
// Implement cursor pagination
import Sequelize from "sequelize";

// Date variables of cursor to/from hash
const toCursorHash = (string) => Buffer.from(string).toString("base64");
const fromCursorHash = (string) =>
  Buffer.from(string, "base64").toString("ascii");

export default {
  // Base query's
  Query: {
    // Multiple Messages
    messages: async (parent, { cursor, limit = 100 }, { models }) => {
      // If cursor, set location point else no options
      const cursorOptions = cursor
        ? {
            where: {
              createdAt: {
                [Sequelize.Op.lt]: fromCursorHash(cursor),
              },
            },
          }
        : {};
      // Return messages from cursor upto limit plus 1
      const messages = await models.Message.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions,
      });

      // Set if more messages are available
      const hasNextPage = messages.length > limit;
      // Set messages to edges based on if more messaged exist
      const edges = hasNextPage ? messages.slice(0, -1) : messages;

      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString()),
        },
      };
    },
    // Single Message
    message: async (parent, { id }, { models }) => {
      // return await models.Message.findByPk(id);
      const message = models.Message.findByPk(id);
      console.log(message);

      return await message;
    },
  },

  // Create, Update and Delete Mutations
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, me }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      }
    ),

    // Return boolean if delete is successful
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      }
    ),
    updateMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id, text }, { models }) => {
        // Update message with user input and return updated message
        return await models.Message.update(
          { text: text },
          { where: { id: id }, returning: true }
        ).then((message) => {
          return message[1][0].dataValues;
        });
      }
    ),
  },

  // Define Message type return value
  Message: {
    // Return user object matching message userId
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};
