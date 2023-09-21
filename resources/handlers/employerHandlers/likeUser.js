const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");

module.exports.likeUser = async (event, context) => {
  console.log("Lmabda function invoked");
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    console.log("Connected to the database");

    const employerId = event.pathParameters.employerId;
    const employer = await Employer.findById(employerId);
    console.log("Employer Id", employer);

    const userEmail = event.pathParameters.userEmail;
    const user = await User.findOne({ email: userEmail });
    console.log("User", user);

    const postId = event.pathParameters.postId;
    const post = await Post.findById(postId);
    console.log("Post", post);

    if (!user || !post || !employer) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          status: "error",
          message: "User, Post or Employer not found",
        }),
      };
    }

    if (post.likedBy.includes(user._id)) {
      await post.recLikes.push(employer);
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
