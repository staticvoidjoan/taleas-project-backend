const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
module.exports.getAllPosts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    console.log("before query")
    try {
            const posts = await Post.find()
            .populate("category")
            .populate("creatorId")
            .populate("likedBy")
            .populate("recLikes");
            
            console.log("after query");
            console.log(posts);
            if (posts.length === 0) {
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
    }catch(error) {
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