// Generate token
import jwt from "jsonwebtoken";
// Apollo error handling
import { AuthenticationError, UserInputError } from "apollo-server";

// Generate token
const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, {
    expiresIn,
  });
};

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
  Mutation: {
    // Add user with hashed password
    signUp: async (
      parent,
      { username, email, password },
      { models, secret }
    ) => {
      const user = await models.User.create({
        username,
        email,
        password,
      });

      return { token: createToken(user, secret, "30m") };
    },
    // Sign in user based on user input.
    signIn: async (
      parent,
      // Login can be username or email
      { login, password },
      { models, secret }
    ) => {
      const user = await models.User.findByLogin(login);
      // Throw user input error if no user found
      if (!user) {
        throw new UserInputError("No user found with this login credentials.");
      }

      // Boolean variable if password if valid
      const isValid = await user.validatePassword(password);

      // If password is not valid, through authentication error
      if (!isValid) {
        throw new AuthenticationError("Invalid password.");
      }
      // Return token for client
      return { token: createToken(user, secret, "30m") };
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
