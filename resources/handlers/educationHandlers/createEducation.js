const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Responses = require("../apiResponses");

module.exports.createEducation = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const userId = event.pathParameters.id;
    const { institution, degree, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if (!institution || !degree || !startDate) {
      return Responses._400({
        error: "Institution name, degree and start date are required.",
      });
    }

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,.'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!textRegex.test(institution)) {
      return Responses._400({
        error: "Institution name must be alphanumeric.",
      });
    }

    if (!textRegex.test(degree)) {
      return Responses._404({ error: "Degree must be alphanumeric." });
    }

    if (!textRegex.test(description)) {
      return Responses._400({ error: "Description must be alphanumeric." });
    }

    if (!dateRegex.test(startDate) || (endDate && !dateRegex.test(endDate))) {
      return Responses._400({
        error: "Start date and end date must be in YYYY-MM-DD format.",
      });
    }

    const newEducation = new Education({
      institution,
      degree,
      startDate,
      endDate,
      description,
    });

    const savedEducation = await newEducation.save();
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { education: savedEducation._id } }
    );
    return Responses._200({status: "success", savedEducation });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred creating education",
    });
  }
};
