const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");

module.exports.createEducation = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const userEmail = event.pathParameters.email;
    const { institution, degree, startDate, endDate, description } = JSON.parse(
      event.body
    );

    if (!institution || !degree || !startDate || !description) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Institution name, degree, start date, and description are required.",
        }),
      };
    }

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!textRegex.test(institution)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error: "Institution name must be alphanumeric.",
        }),
      };
    }

    if (!textRegex.test(degree)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Degree must be alphanumeric." }),
      };
    }

    if (!textRegex.test(description)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Description must be alphanumeric." }),
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
    const newEducation = new Education({
      institution,
      degree,
      startDate,
      endDate,
      description,
    });

    const savedEducation = await newEducation.save();
    const updateUser = await User.findOneAndUpdate(
      { email: userEmail },
      { $push: { education: savedEducation._id } }
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ savedEducation, updateUser }),
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
        message: "An error occurred creating education",
      }),
    };
  }
};
