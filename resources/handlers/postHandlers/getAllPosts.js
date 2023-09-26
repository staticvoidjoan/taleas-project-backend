const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
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
                return Responses._404({message: "No posts found"})
            }
    
            return Responses._200({posts})
    }catch(error) {
        return Responses._500({message: "Internal server error"})
    }
}