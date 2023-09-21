const {connectDB} = require('../../config/dbConfig');
const User = require('../../models/userModel');
const Post = require('../../models/postModel');

module.exports.likePost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();

    const email = event.queryStringParameters.email;
    const user = await User.findOne({ email: email });

    const postId = event.pathParameters.id;
    const post = await Post.findById(postId);

    //Update post likedBy array
    await post.likedBy.push(user);

    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "success", message: "Post liked successfully"}),
      };
} catch (error) {
    console.error("Something went wrong", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "error",
        message: "An error occurred during like",
      }),
    };
  }
}