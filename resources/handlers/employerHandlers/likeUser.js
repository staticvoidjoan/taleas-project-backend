const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");

module.exports.likeUser = async (event, context) => {
  console.log("Lambda function invoked");
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    console.log("Connected to the database");

    const employerId = event.pathParameters.id;
    const employer = await Employer.findById(employerId);
    console.log("Employer Id", employer);

    const postId = event.queryStringParameters.postId;
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

    // Get the list of users who have liked the post
    const usersWhoLikedPost = await User.find({ _id: { $in: post.likedBy } });

    // Check if the employer is not already in the recLikes array
    if (!post.recLikes.includes(employer._id)) {
      // Add the employer's ID to the recLikes array
      post.recLikes.push(employer._id);
      await post.save();
    }

    console.log("Employer liked the user successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "success",
        message: "User liked successfully",
        usersWhoLikedPost,
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
