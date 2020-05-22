export default {
  // Base query's
  Query: {
    // Multiple Messages
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
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
    createMessage: async (parent, { text }, { me, models }) => {
      // Return new message
      return await models.Message.create({
        text,
        userId: me.id,
      });
    },
    // Return boolean if delete is successful
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    },
    updateMessage: async (parent, { id, text }, { models }) => {
      // Update message with user input and return updated message
      return await models.Message.update(
        { text: text },
        { where: { id: id }, returning: true }
      ).then((message) => { 
        return message[1][0].dataValues;
      })
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
