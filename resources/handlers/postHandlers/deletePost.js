const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");


module.exports.deletePost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    const {id} = event.pathParameters;
    await connectDB();

    try{

        const post = await Post.findByIdAndDelete(id);
        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(post)
        }


    }catch(error){

        return {
            statusCode: 500, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(error)
        }
    }
}