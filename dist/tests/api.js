"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.message = exports.deleteUser = exports.signUp = exports.signIn = exports.user = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Provide url request from query
// Address of API
const API_URL = "http://localhost:8000/graphql"; // Query to get user by id

const user = async variables => _axios.default.post(API_URL, {
  query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
  variables
}); // User sign in query


exports.user = user;

const signIn = async variables => await _axios.default.post(API_URL, {
  query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
  variables
}); // User sign up query


exports.signIn = signIn;

const signUp = async variables => await _axios.default.post(API_URL, {
  query: `
      mutation ($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
  variables
}); // Query for deleting user


exports.signUp = signUp;

const deleteUser = async (variables, token) => _axios.default.post(API_URL, {
  query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
  variables
}, {
  headers: {
    "x-token": token
  }
}); // Query to get message by id


exports.deleteUser = deleteUser;

const message = async variables => _axios.default.post(API_URL, {
  query: `
      query ($id: ID!) {
        message(id: $id) {
          text
          user {
            username
            email
          }
        }
      }
    `,
  variables
});

exports.message = message;
//# sourceMappingURL=api.js.map