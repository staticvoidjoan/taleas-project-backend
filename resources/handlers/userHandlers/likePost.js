const {connectDB} = require('../../config/dbConfig');
const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const History = require('../../models/historyModel')

module.exports.likePost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();

    const userId = event.queryStringParameters.id;
    const user = await User.findOne({ _id: userId });

    const postId = event.pathParameters.id;
    const post = await Post.findById(postId);

    const history = await History.findOne({user: userId})
    //Update post likedBy array
    await post.likedBy.push(user);
    await history.likedPosts.push(post);

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