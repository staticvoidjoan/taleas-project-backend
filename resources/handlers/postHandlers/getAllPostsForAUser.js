const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");

module.exports.getAllPostsForAUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    const {userId} = event.pathParameters;
    try {

            const userHistory = History.findOne({user: userId});
            const likedPostIds = userHistory.likedPosts;
            const dislikedPostIds = userHistory.dislikedPosts;

            // Query for new posts that the user hasn't interacted with
            const posts = await Post.find({_id: { $nin: [...likedPostIds, ...dislikedPostIds] }});

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