const { connectDB } = require("../../config/dbConfig");
const Post = require("../../models/postModel");
const mongoose = require("mongoose");
const Responses = require("../apiResponses");
module.exports.updatePost = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    try {
        await connectDB();

        const { id } = event.pathParameters;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return Responses._400({ message: "Please provide a valid post id" });
        }

        const postExists = await Post.findById(id);

        if (!postExists) {
            return Responses._404({ message: "Post not found" });
        }

        const {
            category,
            position,
            requirements,
            description,
        } = JSON.parse(event.body);

        if (!category || !position || !requirements) {
            return Responses._400({message: "Please provide all the required fields"});
        }

        const { id: creatorId } = postExists; // Use the creatorId from the existing post

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {
                category,
                creatorId,
                position,
                requirements,
                description,
            },
            { new: true }
        );

        return Responses._200({ message: "Post updated successfully", updatedPost });
    } catch (error) {
        return Responses._500({ message: "Internal server error" });
    }
};
