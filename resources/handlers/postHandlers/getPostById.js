const connectDB = require("../../config/dbConfig");
const Post = require("../../models/postModel");


module.exports.getPostById = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{

        const { id } = event.pathParameters; 
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : {
                    status: "error", 
                    error: "Please provide a valid id"
                }
            }
        }
        const post = await Post.findById(id);
        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(post)
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