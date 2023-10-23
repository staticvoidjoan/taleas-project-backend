const {connectDB} = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const History = require("../../models/historyModel");
const mongoose = require("mongoose");
const Category = require("../../models/categoryModel");
const User = require("../../models/userModel");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
module.exports.getPostsByCategory = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();

    try {

        const { category } = event.pathParameters; 
        const id = event.queryStringParameters.id;

        console.log("category", category);
        console.log("user id", id);

            if(!mongoose.Types.ObjectId.isValid(category)) {
                return Responses._400({message: "Please provide a valid category id"})
            }
            if(!mongoose.Types.ObjectId.isValid(id)) {
                return Responses._400({message: "Please provide a valid user id"})
            }
            //when provided with a user id, get the user history and get the liked and disliked posts
            const userHistory = await History.findOne({user: id});
            console.log(userHistory)
            const likedPostIds = userHistory?.likedPosts || [];
            const dislikedPostIds = userHistory?.dislikedPosts || [];
            console.log(likedPostIds);
            console.log(dislikedPostIds);
            const posts = await Post.find(
            {category: category,
            _id: { $nin: [...likedPostIds, ...dislikedPostIds] }}).populate("creatorId").populate("category");


            //get users experience and general skills
            const user = await User.findById(userId).populate("experience");
            const userJobPositions = user.experience.map((exp) => exp.position) || [];
            console.log(userJobPositions);
            const userSkills = user.generalSkills || [];
            console.log(userSkills);

            //create regex for job positions and skills

            const jobPositionRegex = userJobPositions.map((position) =>
            new RegExp(position.split(/\s+/).map(escapeRegExp).join("|"), "i"));
            const skillRegex = userSkills.map((skill) =>
            new RegExp(skill.split(/\s+/).map(escapeRegExp).join("|"), "i"));

            function escapeRegExp(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            }

            const postsWithScore = posts.map((post) => {
                const positionMatch = jobPositionRegex.reduce(
                  (matchCount, regex) =>
                    matchCount + (post.position.match(regex) ? 1 : 0),
                  0
                );
          
                const skillMatch = skillRegex.reduce(
                  (matchCount, regex) =>
                    matchCount +
                    (post.requirements.some((req) => req.match(regex)) ? 1 : 0),
                  0
                );
          
                return { post, score: positionMatch + skillMatch };
              });
          
              postsWithScore.sort((a, b) => b.score - a.score);
              const sortedPosts = postsWithScore.map((entry) => entry.post);
          
              if (sortedPosts.length === 0) {
                return Responses._404({ message: "No posts found" });
              }
          
            return Responses._200({sortedPosts})
            }catch(error) {
                return Responses._500({message: "Internal server error"})
            }
}