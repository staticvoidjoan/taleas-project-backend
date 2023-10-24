
const Responses = require("../apiResponses");
const Post = require("../../models/postModel");

module.exports.unmatchEmployee = async (event) => {

    try {

        const employeerId  = event.queryStringParameters.employeerId;
        const employeeId = event.queryStringParameters.employeeId;

        const post = await Post.findOne({employeerId: employeerId});

        if(!post) {
            return Responses._404({
                status: "error",
                message: "Post is not found anywhere",
            });
        }

        if(!post.recLikes.includes(employeeId)) {
            return Responses._400({
                status: "error",
                message: "The user has not liked the post",
            });
        }

        await Post.updateOne({ _id: post._id }, { $pull: { recLikes: employeeId } });
        console.log("User removed from liked array successfully");
        await post.save();

    }catch(error) {
        console.error("Something went wrong", error);
        return Responses._500({
            status: "error",
            message: "Something went wrong",
        });
    }
}