import express from "express";
// Import required modules for Apollo/GraphQL
import { ApolloServer } from 'apollo-server-express';
import schema from './schema';
import resolvers from './resolvers';
import models from './models';
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
  context: {
    me: users[1],
  },
});

// Set API path
server.applyMiddleware({ app, path: "/graphql" });

// Set port to listen to HTTP request
app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
