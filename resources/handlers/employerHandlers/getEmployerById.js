const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Post = require("../../models/postModel");

module.exports.getEmployerById = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const employerId = event.pathParameters.id;
    const employer = await Employer.findOne({ employerId: employerId }).select("-__v");

    if (!employer) {
      console.log("Employer not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Employer not found" }),
      };
    }

    const posts = await Post.find({ creatorId: employerId });

    employer.posts = posts;

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(employer),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while retrieving the employer",
      }),
    };
  }
};
