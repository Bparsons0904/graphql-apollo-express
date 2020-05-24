"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _graphqlResolvers = require("graphql-resolvers");

var _apolloServer = require("apollo-server");

var _authorization = require("./authorization");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Generate token
// Allow for authentications
// Apollo error handling
// Check if user has admin role
// Generate token
const createToken = async (user, secret, expiresIn) => {
  const {
    id,
    email,
    username,
    role
  } = user;
  return await _jsonwebtoken.default.sign({
    id,
    email,
    username,
    role
  }, secret, {
    expiresIn
  });
};

var _default = {
  Query: {
    // Multiple Users
    users: async (parent, args, {
      models
    }) => {
      return await models.User.findAll();
    },
    // Single User
    user: async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.findByPk(id);
    },
    // Current User
    me: async (parent, args, {
      models,
      me
    }) => {
      if (!me) {
        return null;
      }

      return await models.User.findByPk(me.id);
    }
  },
  Mutation: {
    // Add user with hashed password
    signUp: async (parent, {
      username,
      email,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.create({
        username,
        email,
        password
      });
      return {
        token: createToken(user, secret, "30m")
      };
    },
    // Sign in user based on user input.
    signIn: async (parent, // Login can be username or email
    {
      login,
      password
    }, {
      models,
      secret
    }) => {
      const user = await models.User.findByLogin(login); // Throw user input error if no user found

      if (!user) {
        throw new _apolloServer.UserInputError("No user found with this login credentials.");
      } // Boolean variable if password if valid


      const isValid = await user.validatePassword(password); // If password is not valid, through authentication error

      if (!isValid) {
        throw new _apolloServer.AuthenticationError("Invalid password.");
      } // Return token for client


      return {
        token: createToken(user, secret, "30m")
      };
    },
    // Delete a user
    deleteUser: (0, _graphqlResolvers.combineResolvers)(_authorization.isAdmin, async (parent, {
      id
    }, {
      models
    }) => {
      return await models.User.destroy({
        where: {
          id
        }
      });
    })
  },
  // Define User message type return value
  User: {
    messages: async (user, args, {
      models
    }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      });
    }
  }
};
exports.default = _default;
//# sourceMappingURL=user.js.map