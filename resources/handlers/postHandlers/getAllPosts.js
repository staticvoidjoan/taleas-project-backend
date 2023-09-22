const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");


module.exports.getAllPosts = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try {
            const posts = await Post.find()
            .populate("user")
            .populate("Employer")
            .populate("category");
            
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