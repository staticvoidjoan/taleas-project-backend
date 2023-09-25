const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Employer = require('../../models/employerModel');
const Post = require("../../models/postModel");


module.exports.likeUser = async (event, context) => {
  console.log("Lambda function invoked");
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    console.log("Connected to the database");

    const userId = event.queryStringParameters.id;
    const user = await User.findById(userId);
    console.log("User", user);

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: "error",
          message: "User not found",
        }),
      };
    }

    const postId = event.pathParameters.id;
    const post = await Post.findById(postId);
    console.log("Post", post);

    if (!post) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: "error",
          message: "Post not found",
        }),
      };
    }

    // Check if the user has liked the post
    if (!post.likedBy.includes(user._id)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          status: "error",
          message: "The user has not liked this post",
        }),
      };
    }

    // Check if the employer has not already liked the user
    if (!post.recLikes.includes(userId)) {
      // Add the employer's ID to the recLikes array
      post.recLikes.push(userId);
      await post.save();
    }

    console.log("User liked by employer successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "success",
        message: "User liked successfully",
      }),
    };
  } catch (error) {
    console.error("Something went wrong", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: "error",
        message: "An error occurred during liking the user",
      }),
    };
  }
};
