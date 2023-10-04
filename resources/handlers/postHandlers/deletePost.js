const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const Responses = require("../apiResponses");


module.exports.deletePost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id} = event.pathParameters;
    await connectDB();
    try{

        const post = await Post.findByIdAndDelete(id);
        return Responses._200({message: "Post deleted successfully", post})
    }catch(error){
        return Responses._500({message: "Internal server error"})
    }
}