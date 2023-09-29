const {connectDB} = require('../../../config/db');
const Post = require('../../../models/postModel');
const Employer = require('../../../models/employerModel');

module.exports.getMatchesForUser = async (event, context) => {

    try {

        const id = event.pathParameters.id;
        await connectDB();

        const posts = await Post.find({recLikes: id}).populate('creatorId');

        if (!posts) {
            console.log("No posts found where matched");
            return Responses._404({ status: "error", error: "No posts found where matched" });
        }

        return Responses._200({status:"success", posts });


    }catch(error){
        return Responses._500({
            status: "error",
            message: "An error occurred while getting the user",
        });
    }
}