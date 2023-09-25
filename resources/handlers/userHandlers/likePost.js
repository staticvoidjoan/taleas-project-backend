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
    if(!user){
      console.log('User not found');
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "error", message: "User not found"}),
      };
    }

    const postId = event.pathParameters.id;
    const post = await Post.findById(postId);
    if(!post){
      console.log('Post not found');
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "error", message: "Post not found"}),
      };
    }

    const history = await History.findOne({user: userId})
    if(!history) {
      const newEntryInHistory = new History({
          user: userId, 
          likedPosts: [postId],
          dislikedPosts: []
      });
      await newEntryInHistory.save();
  }else{
    const updateHistory = await History.findOneAndUpdate(
      { user: userId },
      { $push: { likedPosts: postId } }
    );
    console.log(updateHistory)
  }

    //Update post likedBy array
    const updatePost = await Post.findOneAndUpdate(
      { _id: postId },
      { $push: { likedBy: userId } }
    );
    console.log(updatePost)

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