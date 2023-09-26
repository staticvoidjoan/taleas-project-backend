const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
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
      return Responses._404({ message: "No posts found" });
    }

    return Responses._200({ posts });
  } catch (error) {
    return Responses._500({ message: "Internal server error" });
  }
};
