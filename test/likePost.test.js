const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { likePost } = require("../resources/handlers/userHandlers/likePost");
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

describe("likePost", () => {
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
  });

  it("should like a post successfully", async () => {
    const event = {
      queryStringParameters: { id: post._id.toString() },
      pathParameters: { id: user._id.toString() },
    };

    const result = await likePost(event);

    expect(result).toEqual({
      body: JSON.stringify({
        status: "success",
        message: "Post liked successfully",
      }),
      headers: {
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      statusCode: 200,
    });
  
    const updatedPost = await Post.findById(post._id);
    expect(updatedPost.likedBy.map(id => id.toString())).toContain(user._id.toString());
  });
});
