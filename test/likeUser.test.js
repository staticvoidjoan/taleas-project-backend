const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { likeUser } = require("../resources/handlers/employerHandlers/likeUser");
const User = require("../resources/models/userModel");
const Post = require("../resources/models/postModel");

jest.mock("../resources/config/dbConfig", () => ({
  connectDB: jest.fn(),
}));

let mongoServer;
let mongoUri;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  mongoUri = await mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("likeUser", () => {
  let user;
  let post;

  beforeEach(async () => {
    user = new User({
      name: "Samuel",
      lastname: "Dervishi",
      email: "dervishisamuel360@gmail.com",
      experience: [],
      certifications: [],
      generalSkills: ["Nodejs", "MongoDB"],
      languages: ["English"],
      links: [],
    });
    await user.save();
  });

  it("should like a user successfully when the post is already liked by the user", async () => {
    post = new Post({
      category: "65103924261c27f48f71b3d2",
      creatorId: "65199912e88d4b85c0ebb8e1",
      likedBy: [user._id.toString()],
      recLikes: [],
      position: "Programues",
      requirements: ["Nodejs"],
      description: "Hello to the new job",
    });
    await post.save();

    const event = {
      queryStringParameters: { id: user._id.toString() },
      pathParameters: { id: post._id.toString() },
    };

    const result = await likeUser(event);

    expect(result).toEqual({
      body: JSON.stringify({
        status: "success",
        message: "User liked successfully",
      }),
      headers: {
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      statusCode: 200,
    });

    const updatedPost = await Post.findById(post._id);
    expect(updatedPost.recLikes.map(id => id.toString())).toContain(user._id.toString());
    expect(updatedPost.likedBy.map(id => id.toString())).not.toContain(user._id.toString());
  });

  it("should not like a user when no one has liked the post yet", async () => {
    post = new Post({
      category: "65103924261c27f48f71b3d2",
      creatorId: "65199912e88d4b85c0ebb8e1",
      likedBy: [],
      recLikes: [],
      position: "Programues",
      requirements: ["Nodejs"],
      description: "Hello to the new job",
    });
    await post.save();

    const event = {
      queryStringParameters: { id: user._id.toString() },
      pathParameters: { id: post._id.toString() },
    };

    const result = await likeUser(event);

    expect(result).toEqual({
      body: JSON.stringify({
        status: "error",
        message: "The user has not liked the post",
      }),
      headers: {
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      statusCode: 400,
    });
  });
});
