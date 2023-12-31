const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Responses = require('../apiResponses');

module.exports.updateEducation = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const id = event.pathParameters.id;
    const education = await Education.findById(id);
    if(!education){
        console.log('Education not found');
        return Responses._404({status: "error", error: "Education not found" })
        };

    const { institution, degree, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if (!institution || !degree || !startDate || !description) {
      return Responses._400({
          error:
            "Institution name, degree, start date, and description are required.",
        })
      };

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,.'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!textRegex.test(institution)) {
      return Responses._404({
          error: "Institution name must be alphanumeric.",
        })
      };

    if (!textRegex.test(degree)) {
      return Responses._400({ error: "Degree must be alphanumeric." })
      };

    if (!textRegex.test(description)) {
      return Responses._400({ error: "Description must be alphanumeric." })
      };

    if (!dateRegex.test(startDate) || (endDate && !dateRegex.test(endDate))) {
      return Responses._400({
          error: "Start date and end date must be in YYYY-MM-DD format.",
        })
      };

      education.institution = institution;
      education.degree = degree;
      education.startDate = startDate;
      education.endDate = endDate;
      education.description = description

    const savedEducation = await education.save();
    return Responses._200({status: "success", savedEducation})
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
        status: "error",
        message: "An error occurred updating education",
      })
    };
};
