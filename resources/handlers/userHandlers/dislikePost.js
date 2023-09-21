const {connectDB} = require("../../config/dbConfig");
const User = require('../../models/userModel');
const Post = require('../../models/postModel');
const History = require('../../models/historyModel');

module.exports.dislikePost = async (event, context)  => {
    context.callbackWaitsForEmptyEventLoop = false;
    try{
        await connectDB();
        const {id} = event.pathParameters; 
        const postId = event.queryStringParameters.id; 
        const user = await User.findById(id);
        //check if user exists
        if(!user) {
            return {
                statusCode: 404, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "User not found"
                }
            }
        }
        const post = await Post.findById(postId);
        if(!post) {
            return {
                statusCode: 404, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Post not found"
                }
            }
        }
        //check if there is any record for this user in database for liked and disliked posts 
        const historyUser = await History.findOne({user: user._id})
        if(!historyUser) {
            const newEntryInHistory = new History({
                user: user._id, 
                dislikedPosts: [postId],
                likedPosts: []
            });
            await newEntryInHistory.save();
        }else{
            historyUser.dislikedPosts.push(postId);
        }

        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            }, 
            body : JSON.stringify({status: "success", message: "Post added to disliked list successfully"})
        }
    }catch(error){
        return {
            statusCode: 500, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : {
                status: "error",
                error: error
            }
        }
    }
}