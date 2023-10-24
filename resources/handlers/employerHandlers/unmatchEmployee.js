const Responses = require("../apiResponses");
const Post = require("../../models/postModel");
const { connectDB } = require("../../config/dbConfig");

module.exports.unmatchEmployee = async (event) => {
  try {
    await connectDB();

    const employeerId = event.queryStringParameters.employeerId;
    const employeeId = event.queryStringParameters.employeeId;

    // Use the updateMany method to remove the employeeId from recLikes in multiple posts
    const result = await Post.updateMany(
      { creatorId: employeerId, recLikes: employeeId },
      { $pull: { recLikes: employeeId } }
    );

    if (result.nModified === 0) {
      return Responses._400({ message: "No posts found or no changes made" });
    }

    return Responses._200({
      status: "success",
      message: "Employee unmatched successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "Something went wrong",
    });
  }
};
