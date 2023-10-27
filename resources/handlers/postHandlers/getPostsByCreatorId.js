const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
module.exports.getPostsByCreatorId = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try{
      const { creatorId } = event.pathParameters;
      const page = parseInt(event.queryStringParameters.page) || 1;
      const limit = parseInt(event.queryStringParameters.limit) || 10;
      
      if(!mongoose.Types.ObjectId.isValid(creatorId)) { 
        return Responses._400({message: "Please provide a valid creator id"})
      }
  
      const employer = await Employer.findById(creatorId);
  
      const blockedUsersIds = employer.blockedUsers.map((user) => user._id);
  
      const posts = await Post.find({
        creatorId: creatorId
      }).skip((page - 1) * limit).limit(limit)
        .populate({
          path: 'likedBy',
          match: { _id: { $nin: blockedUsersIds } }
        })
        .populate("recLikes")
        .populate("category")
        .populate("creatorId");
  
      if(posts.length === 0) {
        return Responses._404({message: "No posts found"})
      }
      
      return Responses._200(
        {
          posts: posts,
          count: count,
          pageCount: pageCount
        }
      )
  
    }catch(error){
      console.log(error);
      return Responses._500({message: "Internal server error"})
    }
  };
  