const { likePost } = require("../resources/handlers/userHandlers/likePost");
const { connectDB } = require("../resources/config/dbConfig");
const User = require("../resources/models/userModel");
const Post = require("../resources/models/postModel");
const History = require("../resources/models/historyModel");
const Responses = require("../resources/handlers/apiResponses");

jest.mock("../resources/config/dbConfig");
jest.mock("../resources/models/userModel");
jest.mock("../resources/models/postModel");
jest.mock("../resources/models/historyModel");

const expectedHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

describe("likePost", () => {
it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);
  
    const event = {
      pathParameters: { id: "65199429b361e407af5bb104" },
      queryStringParameters: { id: "6519991a8d591acc205faa9d" },
    };
  
    const response = await likePost(event);
    expect(response).toEqual({
      statusCode: 404,
      body: JSON.stringify({ status: "error", message: "User not found" }),
      headers: expectedHeaders,
    });
  });
  
  it("should return 404 if post not found", async () => {
    User.findOne.mockResolvedValue({});
    Post.findById.mockResolvedValue(null);
  
    const event = {
      pathParameters: { id: "65199429b361e407af5bb104" },
      queryStringParameters: { id: "6519991a8d591acc205faa9d" },
    };
  
    const response = await likePost(event);
    expect(response).toEqual({
      statusCode: 404,
      body: JSON.stringify({ status: "error", message: "Post not found" }),
      headers: expectedHeaders,
    });
  });
  
  it("should return 200 if post is liked successfully", async () => {
    User.findOne.mockResolvedValue({});
    Post.findById.mockResolvedValue({});
    History.findOne.mockResolvedValue(null);
  
    const event = {
      pathParameters: { id: "65199429b361e407af5bb104" },
      queryStringParameters: { id: "6519991a8d591acc205faa9d" },
    };
  
    const response = await likePost(event);
  
    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "Post liked successfully",
      }),
      headers: expectedHeaders,
    });
  });
  
});
