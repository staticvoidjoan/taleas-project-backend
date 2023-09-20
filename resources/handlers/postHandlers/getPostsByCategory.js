const connectDB = require("../../config/dbConfig");
const Post = require("../../models/postModel");


module.exports.getPostsByCategory = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();

    try {

        const { category } = event.pathParameters: 

        if(!mongoose.Types.ObjectId.isValid(category)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid category id"
                }
            }
        }

        const posts = await Post.find({category: category});
        if (posts.length === 0) {
            return {
                statusCode: 404, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "No posts found"
                }
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