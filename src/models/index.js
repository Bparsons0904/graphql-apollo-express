import { delegateToSchema } from "apollo-server";

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

export default {
  users,
  messages,
};
