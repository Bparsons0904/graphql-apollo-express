// Import express and apollo
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
// Allow for cross-domain request
import cors from "cors";

// set app variable to express main function
const app = express();

// Allow cross domain request
app.use(cors());

// GraphQL schema, set types
const schema = gql`
  type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  type User {
    id: ID!
    username: String!
  }
`;

// Static data for testing
let users = {
  1: {
    id: "1",
    username: "Bob Parsons",
  },
  2: {
    id: "2",
    username: "Dave Davids",
  },
};

const me = users[1];

// GraphQL resolvers, set returns
const resolvers = {
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: () => {
      return me;
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
