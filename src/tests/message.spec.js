// Test module from chai
import { expect } from "chai";
import * as messageApi from "./api";

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
              email: "hello@robin.com",
            },
          },
        },
      };

      // Result of message query
      const result = await messageApi.message({ id: "1" });
      // Compare result to expected result
      expect(result.data).to.eql(expectedResult);
    });
    it("returns error when message cannot be found", async () => {
      // Query message which does not exist
      const result = await messageApi.message({ id: "42" });
      // Compare result to see ensure has errors property
      expect(result.data).to.have.property("errors");
    });
  });
});
