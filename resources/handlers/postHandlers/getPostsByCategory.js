const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const mongoose = require("mongoose");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");

module.exports.getPostsByCategory = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();

    try {

        const { category } = event.pathParameters; 

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
        //when provided with a user id, get the user history and get the liked and disliked posts
        // const userHistory = History.findOne({user: id});
        // const likedPostIds = userHistory.likedPosts;
        // const dislikedPostIds = userHistory.dislikedPosts;
        //find post where category is equal to category id and id of the post is not in the liked or disliked posts from the user history
        // const posts = await Post.find(
        //     {category: category, 
        //     _id: { $nin: [...likedPostIds, ...dislikedPostIds] }
        // })
        const posts = await Post.find({category: category})
        .populate("likedBy")
        .populate("recLikes")
        .populate("creatorId");
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