const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.getPostsByCreatorIdNoPagination = async (event, context) => {

    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{
        const { creatorId } = event.pathParameters;
        if(!mongoose.Types.ObjectId.isValid(creatorId)) { 
            return Responses._400({message: "Please provide a valid creator id"})
        }

        const posts = await Post.find({creatorId: creatorId}).populate("recLikes");

        if(posts.length === 0) {
            return Responses._404({message: "No posts found"})
        }
        return Responses._200({posts: posts})

    }catch(error){
        console.log(error);
        return Responses._500({message: "Internal server error"})
    }
}

