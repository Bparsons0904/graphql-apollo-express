"use strict";

var _chai = require("chai");

var messageApi = _interopRequireWildcard(require("./api"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Test module from chai
// Test cases for messages
describe("messages", () => {
  describe("message(id: String!): Message", () => {
    it("returns a message when message can be found", async () => {
      // Expected result of message search by id
      const expectedResult = {
        data: {
          message: {
            text: "Published the Road to learn React",
            user: {
              username: "rwieruch",
              email: "hello@robin.com"
            }
          }
        }
      }; // Result of message query

      const result = await messageApi.message({
        id: "1"
      }); // Compare result to expected result

      (0, _chai.expect)(result.data).to.eql(expectedResult);
    });
    it("returns error when message cannot be found", async () => {
      // Query message which does not exist
      const result = await messageApi.message({
        id: "42"
      }); // Compare result to see ensure has errors property

      (0, _chai.expect)(result.data).to.have.property("errors");
    });
  });
});
//# sourceMappingURL=message.spec.js.map