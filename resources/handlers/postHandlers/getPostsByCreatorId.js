const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");


module.exports.getPostsByCreatorId = async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{
        const { creatorId } = event.pathParameters;
        if(!mongoose.Types.ObjectId.isValid(id)) { 
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify({
                    status: "error", 
                    error: "Please provide a valid creator id"
                })
            }
        }

        const posts = await Post.find({creatorId: creatorId})
        .populate("users")
        .populate("category");
        if(posts.length === 0) {
            return {
                statusCode: 404, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify({
                    status: "error", 
                    error: "No posts found"
                })
            }
        }
        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(posts)
        }

    }catch(error){
        console.log(error);
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