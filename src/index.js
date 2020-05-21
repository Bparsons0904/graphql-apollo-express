// Import express and apollo
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
// Allow for cross-domain request
import cors from 'cors';

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// GraphQL schema, set types
const schema = gql`
  type Query {
    me: User
  }

  type User {
    username: String!
  }
`;

// GraphQL resolvers, set returns
const resolvers = {
  Query: {
    me: () => {
      return {
        username: "Bob Parsons",
      };
    },
  },
};

// Init apollo server with schema and resolvers
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

// Set API path
server.applyMiddleware({ app, path: "/graphql" });

// Set port to listen to HTTP request
app.listen({ port: 8000 }, () => {
  console.log("Apollo Server on http://localhost:8000/graphql");
});
