const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Experience = require("../../models/experienceModel");
const Responses = require('../apiResponses');

module.exports.deleteExperience = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const experienceId = event.pathParameters.id;
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      console.log("Experience not found");
      return Responses._404({ error: "Experience not found" });
    }

    // Remove the education's ID from the user education array
    await User.findOneAndUpdate(
      { experience: experienceId },
      { $pull: { experience: experienceId } }
    );

    await Experience.findByIdAndDelete(experienceId);
    return Responses._200({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error while deleting experience",
    });
  }
};
