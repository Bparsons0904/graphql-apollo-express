export default {
  Query: {
    // Multiple Users
    users: async (parent, args, { models }) => {
      return await models.User.findAll();
    },
    // Single User
    user: async (parent, { id }, { models }) => {
      return await models.User.findByPk(id);
    },
    // Current User
    me: async (parent, args, { models, me }) => {
      if (!me) {
        return null;
      }
      return await models.User.findByPk(me.id);
    },
  },
  // Define User message type return value
  User: {
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id,
        },
      });
    },
  },
};
