const {connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");

module.exports.createPost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectDB();
    try{
        const {creatorId} = event.pathParameters; 
        console.log(creatorId);
        const {category, position , requirements, description} = JSON.parse(event.body);
        console.log(event.body);
        if(!category || !position || !requirements || !description ) {
            return {
                statusCode: 400, 
                headers : {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body : JSON.stringify({
                    status: "error", 
                    error: "Please provide all the required fields"
                })
            }
        }
        console.log("1 here");
        if(!mongoose.Types.ObjectId.isValid(creatorId)) {
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
        const newPost = new Post({
            category,
            creatorId,
            position,
            requirements,
            description
        });
        console.log(newPost);
        await newPost.save();
        return {
            statusCode: 200, 
            headers : {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body : JSON.stringify(newPost)
        }
    }catch(error) {
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