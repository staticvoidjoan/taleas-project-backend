const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Post = require("../../models/postModel");
const Responses = require("../apiResponses");

module.exports.likeUser = async (event, context) => {
  console.log("Lambda function invoked");
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  try {
    const userId = event.queryStringParameters.id;
    const user = await User.findById(userId);
    console.log("User", user);

    if (!user) {
      console.log("User is not found anywhere");
      return Responses._404({
        status: "error",
        message: "User is not found anywhere",
      });
    }

    const postId = event.pathParameters.id;
    const post = await Post.findById(postId);
    console.log("Post", post);

    if (!post) {
      console.log("Post is not found anywhere");
      return Responses._404({
        status: "error",
        message: "Post is not found anywhere",
      });
    }

    // Check if the user has liked the post
    if (!post.likedBy.includes(user._id)) {
      return Responses._400({
        status: "error",
        message: "The user has not liked the post",
      });
    }

    // Check if the employer has not already liked the user
    if (!post.recLikes.includes(userId)) {
      // Add the employer's ID to the recLikes array
      await post.recLikes.push(userId);

      await Post.updateOne({ _id: post._id }, { $pull: { likedBy: user._id } });
      console.log("User removed from liked array successfully");
      await post.save();
    }

    console.log("User liked by employer successfully");

    return Responses._200({
      status: "success",
      message: "User liked successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while liking the user, check the logs for more information",
    });
  }
};
