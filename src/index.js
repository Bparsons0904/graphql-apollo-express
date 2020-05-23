import express from "express";
// Token generation
import jwt from "jsonwebtoken";
// Import required modules for Apollo/GraphQL
import { ApolloServer, AuthenticationError } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
// Allow for cross-domain request
import cors from "cors";

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// Set current user
const getMe = async (req) => {
  // token from header
  const token = req.headers["x-token"];
  // If token is found
  if (token) {
    // Verify token matches secret token
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError("Your session expired. Sign in again.");
    }
  }
};

// Init apollo server with schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  formatError: (error) => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message
      .replace("SequelizeValidationError: ", "")
      .replace("Validation error: ", "");

    return {
      ...error,
      message,
    };
  },
  context: async ({ req }) => {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: process.env.SECRET,
    };
  },
});

// Set API path
server.applyMiddleware({ app, path: "/graphql" });

// Value to determine if database values should be reset
const eraseDatabaseOnSync = true;

// Connect to postgres database through sequelize
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages(new Date());
  }
  // Listen on localhost:8000 for HTTP request
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});

// Clean database with each reload
const createUsersWithMessages = async date => {
  await models.User.create(
    {
      username: "rwieruch",
      email: "hello@robin.com",
      password: "rwieruch",
      role: "ADMIN",
      messages: [
        {
          text: "Published the Road to learn React",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );

  await models.User.create(
    {
      username: "ddavids",
      email: "hello@david.com",
      password: "ddavids",
      messages: [
        {
          text: "Happy to release ...",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
        {
          text: "Published a complete ...",
          createdAt: date.setSeconds(date.getSeconds() + 1),
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
