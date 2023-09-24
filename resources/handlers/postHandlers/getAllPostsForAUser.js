const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");

module.exports.getAllPostsForAUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  const { userId } = event.pathParameters;

  try {
    const userHistory = await History.findOne({ user: userId });
    console.log(userHistory)
    const likedPostIds = userHistory?.likedPosts || [];
    const dislikedPostIds = userHistory?.dislikedPosts || [];
    console.log(likedPostIds);
    console.log(dislikedPostIds);
    // Query for new posts that the user hasn't interacted with
    const posts = await Post.find({
      _id: { $nin: [...likedPostIds, ...dislikedPostIds] },
    })
      .populate("likedBy")
      .populate("recLikes")
      .populate("category")
      .populate("creatorId");

    if (posts.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          status: "error",
          error: "No posts found",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(posts),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(error),
    };
  }
};
