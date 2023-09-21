const connectDB = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");

module.exports.deleteEmployer = async (event) => {
  console.log("Lambda fucntion invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const employerId = event.pathParameters.id;
    console.log("Employer Id", employerId);

    const deleteEmployer = await Employer.findByIdAndRemove(employerId);
    if (!deleteEmployer) {
      console.log("Employer not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Employer not found " }),
      };
    }

    console.log("Employer deleted successfully");

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Employer deleted successfully" }),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while deleting the employer",
      }),
    };
  }
};
