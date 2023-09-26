const {connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");
const Responses = require("../apiResponses")
module.exports.createPost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    await connectDB();
    try{
        const {creatorId} = event.pathParameters; 
        console.log(creatorId);
        const {category, position , requirements, description} = JSON.parse(event.body);
        console.log(event.body);
        if(!category || !position || !requirements || !description ) {
            return Responses._400({message: "Please provide all the required fields"})
        }
        console.log("1 here");
        if(!mongoose.Types.ObjectId.isValid(creatorId)) {
            return Responses._400({message: "Please provide a valid creator id"})
        }
        if(!mongoose.Types.ObjectId.isValid(category)) {
            return Responses._400({message: "Please provide a valid category id"})
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
        return Responses._200({message: "Post created successfully", newPost})
    }catch(error) {
        console.log(error);
        return Responses._500({message: "Internal server error"})
    }
}