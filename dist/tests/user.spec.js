"use strict";

var _chai = require("chai");

var userApi = _interopRequireWildcard(require("./api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Test module from chai
// Test cases for user
describe("users", () => {
  describe("user(id: String!): User", () => {
    it("returns a user when user can be found", async () => {
      // Expected results for comparison
      const expectedResult = {
        data: {
          user: {
            id: "1",
            username: "rwieruch",
            email: "hello@robin.com",
            role: "ADMIN"
          }
        }
      }; // Get data for user 1

      const result = await userApi.user({
        id: "1"
      }); // Compare expected result matches returned results

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
    it("returns null when user cannot be found", async () => {
      const expectedResult = {
        data: {
          user: null
        }
      }; // Get user which doesn't exist

      const result = await userApi.user({
        id: "42"
      }); // compare expected results match returned results

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
  });
  describe("deleteUser(id: String!): Boolean!", () => {
    it("returns an error because only admins can delete a user", async () => {
      // Login in non admin user, set token value
      const {
        data: {
          data: {
            signIn: {
              token
            }
          }
        }
      } = await userApi.signIn({
        login: "ddavids",
        password: "ddavids"
      }); // Attempt to delete user, set error value

      const {
        data: {
          errors
        }
      } = await userApi.deleteUser({
        id: "1"
      }, token); // Compare expected error is found in error

      (0, _chai.expect)(errors[0].message).to.eql("Not authorized as admin.");
    });
  });
  describe("signUp(username: String!, email: String!, password: String!): Token", () => {
    it("returns a token for new user", async () => {
      // Result of user query
      const result = await userApi.signUp({
        username: "111111fdsaskdjbf111",
        email: "1d111111eadgsdafsddstyle@gmail.com",
        password: "deadpass2020"
      }); // Check to ensure results do not have errors property

      (0, _chai.expect)(result.data).to.not.have.property("errors");
    });
  });
});
//# sourceMappingURL=user.spec.js.map