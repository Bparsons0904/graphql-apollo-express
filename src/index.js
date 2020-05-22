import express from "express";
// Import required modules for Apollo/GraphQL
import { ApolloServer } from "apollo-server-express";
import schema from "./schema";
import resolvers from "./resolvers";
import models, { sequelize } from "./models";
// Allow for cross-domain request
import cors from "cors";

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// Init apollo server with schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async () => ({
    models,
    me: await models.User.findByLogin("rwieruch"),
  }),
});

// Set API path
server.applyMiddleware({ app, path: "/graphql" });

const eraseDatabaseOnSync = true;

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }

  // Listen on localhost:8000 for HTTP request
  app.listen({ port: 8000 }, () => {
    console.log("Apollo Server on http://localhost:8000/graphql");
  });
});

// Clean database with each reload
const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: "rwieruch",
      messages: [
        {
          text: "Published the Road to learn React",
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
      messages: [
        {
          text: "Happy to release ...",
        },
        {
          text: "Published a complete ...",
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};
