const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Experience = require("../../models/experienceModel");

module.exports.updateExperience = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const experienceId = event.pathParameters.id;
    const experience = await Experience.findById(experienceId);
    const { employer, position, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if(!experience) {
        console.log('Experience not found');
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "Experience not found" }),
        };
    }

    if (!employer || !position || !startDate) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Employer, position and start date are required.",
        }),
      };
    }

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!textRegex.test(employer) || !textRegex.test(position)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Employer and position must be alphanumeric.",
          }),
        };
      }

      // Validate start date and end date fields
      if (!startDate) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Start date is required." }),
        };
      }

      if (!dateRegex.test(startDate) || (endDate && !dateRegex.test(endDate))) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          }),
        };
      }

      // Validate description field
      if (!description) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Description is required." }),
        };
      }

      if (!textRegex.test(description)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Description is required." }),
        };
      }

      experience.employer = employer;
      experience.position = position;
      experience.startDate = startDate;
      experience.endDate = endDate;
      experience.description = description;

    const savedExperience = await experience.save();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ savedExperience }),
    };
  } catch (error) {
    console.error("Something went wrong", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "error",
        message: "An error occurred creating experience",
      }),
    };
  }
};
