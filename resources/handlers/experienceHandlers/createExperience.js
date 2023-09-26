const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Experience = require("../../models/experienceModel");
const Responses = require("../apiResponses");

module.exports.createExperience = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const userId = event.pathParameters.id;
    const { employer, position, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if (!employer || !position || !startDate) {
      return Responses._400({
        error: "Employer, position and start date are required.",
      });
    }

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,.'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!textRegex.test(employer) || !textRegex.test(position)) {
      return Responses._400({
        error: "Employer and position must be alphanumeric.",
      });
    }

    if (!dateRegex.test(startDate) || (endDate && !dateRegex.test(endDate))) {
      return Responses._400({
        error: "Start date and end date must be in YYYY-MM-DD format.",
      });
    }

    if (!textRegex.test(description)) {
      return Responses._400({ error: "Description is required." });
    }

    const experience = new Experience({
      employer,
      position,
      startDate,
      endDate,
      description,
    });

    const savedExperience = await experience.save();
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { experience: savedExperience._id } }
    );
    return Responses._200({status:"success", savedExperience });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred creating experience",
    });
  }
};
