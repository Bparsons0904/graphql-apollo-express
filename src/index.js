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
    me: User
    user(id: ID!): User
    messages: [Message!]!
    message(id: ID!): Message!
  }

  type User {
    id: ID!
    username: String!
    messages: [Message!]
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }
`;

// Static data for testing
let users = {
  1: {
    id: "1",
    username: "Bob Parsons",
    messageIds: [1, 3, 5],
  },
  2: {
    id: "2",
    username: "Dave Davids",
    messageIds: [2, 4, 6],
  },
};

let messages = {
  1: {
    id: "1",
    text: "Hello World",
    userId: "1",
  },
  2: {
    id: "2",
    text: "By World",
    userId: "2",
  },
  3: {
    id: "3",
    text: "See ya World",
    userId: "1",
  },
  4: {
    id: "4",
    text: "Its a new World",
    userId: "2",
  },
  5: {
    id: "5",
    text: "Another extra",
    userId: "1",
  },
  6: {
    id: "6",
    text: "My 2nd message",
    userId: "3",
  },
};

// Replaced by apollo server context
// const me = users[1];

// GraphQL resolvers, set returns
const resolvers = {
  // Base querys
  Query: {
    users: () => {
      return Object.values(users);
    },
    user: (parent, { id }) => {
      return users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
    messages: () => {
      return Object.values(messages);
    },
    message: (parent, { id }) => {
      return messages[id];
    },
  },
  // Define User message type return value
  User: {
    messages: (user) => {
      // Return array of messages matching user ID
      return Object.values(messages).filter(
        (message) => message.userId === user.id
      );
    },
  },
  // Define Message type return value
  Message: {
    // Return user object matching message userId
    user: (message) => {
      return users[message.userId];
    },
  },
};

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
