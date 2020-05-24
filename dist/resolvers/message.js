"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _graphqlResolvers = require("graphql-resolvers");

var _authorization = require("./authorization");

var _sequelize = _interopRequireDefault(require("sequelize"));

var _subscription = _interopRequireWildcard(require("../subscription"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Allow for authentication checks
// Custom authentication methods
// Implement cursor pagination
// Subscription services for messages
// Date variables of cursor to/from hash
const toCursorHash = string => Buffer.from(string).toString("base64");

const fromCursorHash = string => Buffer.from(string, "base64").toString("ascii");

var _default = {
  // Base query's
  Query: {
    // Multiple Messages
    messages: async (parent, {
      cursor,
      limit = 100
    }, {
      models
    }) => {
      // If cursor, set location point else no options
      const cursorOptions = cursor ? {
        where: {
          createdAt: {
            [_sequelize.default.Op.lt]: fromCursorHash(cursor)
          }
        }
      } : {}; // Return messages from cursor upto limit plus 1

      const messages = await models.Message.findAll({
        order: [["createdAt", "DESC"]],
        limit: limit + 1,
        ...cursorOptions
      }); // Set if more messages are available

      const hasNextPage = messages.length > limit; // Set messages to edges based on if more messaged exist

      const edges = hasNextPage ? messages.slice(0, -1) : messages;
      return {
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: toCursorHash(edges[edges.length - 1].createdAt.toString())
        }
      };
    },
    // Single Message
    message: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.findByPk(id);
    }
  },
  // Create, Update and Delete Mutations
  Mutation: {
    createMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, async (parent, {
      text
    }, {
      models,
      me
    }) => {
      const message = await models.Message.create({
        text,
        userId: me.id
      });

      _subscription.default.publish(_subscription.EVENTS.MESSAGE.CREATED, {
        messageCreated: {
          message
        }
      });

      return message;
    }),
    // Return boolean if delete is successful
    deleteMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, _authorization.isMessageOwner, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.Message.destroy({
        where: {
          id
        }
      });
    }),
    updateMessage: (0, _graphqlResolvers.combineResolvers)(_authorization.isAuthenticated, _authorization.isMessageOwner, async (parent, {
      id,
      text
    }, {
      models
    }) => {
      // Update message with user input and return updated message
      return await models.Message.update({
        text: text
      }, {
        where: {
          id: id
        },
        returning: true
      }).then(message => {
        return message[1][0].dataValues;
      });
    })
  },
  // Define Message type return value
  Message: {
    // Return user object matching message userId
    user: async (message, args, {
      models
    }) => {
      return await models.User.findByPk(message.userId);
    }
  },
  // Subscription services
  Subscription: {
    messageCreated: {
      subscribe: () => _subscription.default.asyncIterator(_subscription.EVENTS.MESSAGE.CREATED)
    }
  }
};
exports.default = _default;
//# sourceMappingURL=message.js.map