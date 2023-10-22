const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const Responses = require("../apiResponses");

module.exports.likePost = async (event, context) => {
  // context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();

    const userId = event.pathParameters.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      console.log("User not found");
      return Responses._404({ status: "error", message: "User not found" });
    }

    const postId = event.queryStringParameters.id;
    const post = await Post.findById(postId);
    if (!post) {
      console.log("Post not found");
      return Responses._404({ status: "error", message: "Post not found" });
    }

    const history = await History.findOne({ user: userId });
    if (!history) {
      const newEntryInHistory = new History({
        user: userId,
        likedPosts: [postId],
        dislikedPosts: [],
      });
      await newEntryInHistory.save();
    } else {
      const updateHistory = await History.findOneAndUpdate(
        { user: userId },
        { $push: { likedPosts: postId } }
      );
      console.log(updateHistory);
    }

    //Update post likedBy array
    const updatePost = await Post.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likedBy: userId } }
    );
    
    console.log(updatePost);

    return Responses._200({
      status: "success",
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred during like",
    });
  }
};
