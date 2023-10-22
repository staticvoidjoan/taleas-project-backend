const { likeUser } = require("../resources/handlers/employerHandlers/likeUser");
const User = require("../resources/models/userModel");
const Post = require("../resources/models/postModel");
const {connectDB} = require('../resources/config/dbConfig');

jest.mock("../resources/config/dbConfig");
jest.mock("../resources/models/userModel");
jest.mock("../resources/models/postModel");

const expectedHeaders = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

describe("likeUser", () => {
  it("should return 404 if user not found", async () => {
    User.findById.mockResolvedValue(null);

    const event = {
      pathParameters: { id: "65199429b361e407af5bb104" },
      queryStringParameters: { id: "6519991a8d591acc205faa9d" },
    };

    const response = await likeUser(event);
    expect(response).toEqual({
      statusCode: 404,
      body: JSON.stringify({ status: "error", message: "User is not found anywhere" }),
      headers: expectedHeaders,
    });
  });

  it("should return 404 if post not found", async () => {
    User.findById.mockResolvedValue({});
    Post.findById.mockResolvedValue(null);

    const event = {
      pathParameters: { id: "65199429b361e407af5bb104" },
      queryStringParameters: { id: "6519991a8d591acc205faa9d" },
    };

    const response = await likeUser(event);
    expect(response).toEqual({
      statusCode: 404,
      body: JSON.stringify({ status: "error", message: "Post is not found anywhere" }),
      headers: expectedHeaders,
    });
  });

  it("should return 200 if user is liked successfully", async () => {
    const mockUser = { _id: "6519991a8d591acc205faa9d" };
    const mockPost = { _id: "65199429b361e407af5bb104", likedBy: [mockUser._id], recLikes: [] };

    User.findById.mockResolvedValue(mockUser);
    Post.findById.mockResolvedValue({
      _id: "65199429b361e407af5bb104", 
      likedBy: [mockUser._id], 
      recLikes: [],
      save: jest.fn().mockResolvedValue(true),
    });
    

    const event = {
      pathParameters: { id: mockPost._id },
      queryStringParameters: { id: mockUser._id },
    };

    const response = await likeUser(event);

    expect(response).toEqual({
      statusCode: 200,
      body: JSON.stringify({
        status: "success",
        message: "User liked successfully",
      }),
      headers: expectedHeaders,
    });
  });
});
