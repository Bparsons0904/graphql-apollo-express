export default {
  Query: {
    // Multiple Users
    users: (parent, args, { models }) => {
      return Object.values(models.users);
    },
    // Single User
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    // Current User
    me: (parent, args, { me }) => {
      return me;
    },
  },
  // Define User message type return value
  User: {
    messages: (user, args, { models }) => {
      // Return array of messages matching user ID
      return Object.values(models.messages).filter(
        (message) => message.userId === user.id
      );
    },
  },
};
