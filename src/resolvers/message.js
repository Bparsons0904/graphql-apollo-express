import { v4 as uuidv4 } from "uuid";

export default {
  // Base query's
  Query: {
    // Multiple Messages
    messages: (parent, args, { models }) => {
      return Object.values(models.messages);
    },
    // Single Message
    message: (parent, { id }, { models }) => {
      return models.messages[id];
    },
  },

  // Create, Update and Delete Mutations
  Mutation: {
    createMessage: (parent, { text }, { me, models }) => {
      // Generate new ID
      const id = uuidv4();
      // Create message with user input and new id
      const message = {
        id,
        text,
        userId: me.id,
      };
      // Set message into messages based on ID
      models.messages[id] = message;
      // Add messageId to array of user messages
      models.users[me.id].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }, { models }) => {
      // Set message variable to message to be deleted,
      // Set remainder of array to otherMessages
      const { [id]: message, ...otherMessages } = models.messages;

      // Return false if message not found
      if (!message) {
        return false;
      }
      // Set messages to remaining messages array
      models.messages = otherMessages;
      return true;
    },
    updateMessage: (parent, { id, text }, { models }) => {
      // Set message variable to message to be updated
      const { [id]: message } = models.messages;
      // Return false if selected message not found
      if (!message) {
        return false;
      }
      // Set message to new text value
      message.text = text;
      return message;
    },
  },

  // Define Message type return value
  Message: {
    // Return user object matching message userId
    user: (message, args, { models }) => {
      return models.users[message.userId];
    },
  },
};
