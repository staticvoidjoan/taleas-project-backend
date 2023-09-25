const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");

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
        console.log('User not found');
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "User not found" }),
        };
      }
  
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(user),
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
        message: "An error occurred while getting the user",
      }),
    };
  }
};
