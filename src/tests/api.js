// Provide url request from query
import axios from "axios";

// Address of API
const API_URL = "http://localhost:8000/graphql";

// Query to get user by id
export const user = async (variables) =>
  axios.post(API_URL, {
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
    variables,
  });

// User sign in query
export const signIn = async (variables) =>
  await axios.post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables,
  });

// User sign up query
export const signUp = async (variables) =>
  await axios.post(API_URL, {
    query: `
      mutation ($username: String!, $email: String!, $password: String!) {
        signUp(username: $username, email: $email, password: $password) {
          token
        }
      }
    `,
    variables,
  });

// Query for deleting user
export const deleteUser = async (variables, token) =>
  axios.post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables,
    },
    {
      headers: {
        "x-token": token,
      },
    }
  );

// Query to get message by id
export const message = async (variables) =>
  axios.post(API_URL, {
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
    variables,
  });
