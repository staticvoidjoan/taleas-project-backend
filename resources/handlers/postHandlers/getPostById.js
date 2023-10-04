const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
module.exports.getPostById = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{

        const { id } = event.pathParameters; 
        if(!mongoose.Types.ObjectId.isValid(id)) {
            return Responses._400({message: "Please provide a valid post id"})
        }
        const post = await Post.findById(id)
        .populate("likedBy")
        .populate("recLikes")
        .populate("category")
        .populate("creatorId");
        return Responses._200({post})  

    }catch(error){
        console.log(error);
        return Responses._500({message: "Internal server error"})
    }
}