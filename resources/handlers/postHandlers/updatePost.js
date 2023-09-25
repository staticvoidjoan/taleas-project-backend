const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");


module.exports.updatePost = async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{
        const creatorId = event.pathParameters.id; 
        const {id} = event.queryStringParameters;

        if(!mongoose.Types.ObjectId.isValid(id)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify(
                    {
                        status: "error", 
                        error: "Please provide a valid id"
                    }
                )
            }
        }
        const postExists = await Post.findById(id);
        if(!postExists) {
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                }, 
                body:JSON.stringify( {
                    status: "error",
                    error: "Post not found"
                })
            }
        }
        const {category, position, requirements, description} = JSON.parse(event.body);
        if(!category  || !position || !requirements ) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify( {
                    status: "error", 
                    error: "Please provide all the required fields"
                })
            }
        }
        if(!mongoose.Types.ObjectId.isValid(creatorId)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify( {
                    status: "error", 
                    error: "Please provide a valid creator id"
                })
            }
        }
        if(!mongoose.Types.ObjectId.isValid(category)) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify({
                    status: "error", 
                    error: "Please provide a valid category id"
                })
            }
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            {category, 
             creatorId, 
             position, 
             requirements, 
             description
            }, 
             {new: true});

        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(updatedPost)
        }
    }catch(error) {

        return {
            statusCode: 500, 
            headers: {
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Credentials": true,
            }, 
            body: JSON.stringify(error)
        }

    }
}