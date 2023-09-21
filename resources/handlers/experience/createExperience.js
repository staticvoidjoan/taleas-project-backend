const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Experience = require("../../models/experienceModel");

module.exports.createExperience = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const userEmail = event.pathParameters.email;
    const { empolyer, position, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if (!empolyer || !position || !startDate) {
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

    if (!textRegex.test(empolyer) || !textRegexRegex.test(position)) {
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

      if (!dateRegex.test(startDate) || (exp.endDate && !dateRegex.test(endDate))) {
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

    const experience = new Experience({
      empolyer,
      position,
      startDate,
      endDate,
      description
    });

    const savedExperience = await experience.save();
    const updateUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { experience: savedExperience._id } }
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ savedExperience, updateUser }),
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
