const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");
const Responses = require("../apiResponses");

module.exports.getUserByEmail = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();

    const userEmail = event.pathParameters.email;
    const user = await User.findOne({ email: userEmail })
      .select("-__v")
      .populate("education")
      .populate("experience")
      .populate("certifications");

    if (!user) {
      console.log("User not found");
      return Responses._404({ status: "error", message: "User not found" });
    }

    return Responses._200({status: "success", user});
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while getting the user",
    });
  }
};
