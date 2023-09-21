const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");

module.exports.updateEmployer = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const { companyName, address, industry } = JSON.parse(event.body);
    console.log("Received data", event.body);

    const employerId = event.pathParameters.id;
    const employer = await Employer.findOne({ employerId: employerId });
    console.log("Employer Id", employerId);

    if (!employer) {
      console.log("Employer not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Employer not found" }),
      };
    }
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(companyName)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! The company name should only contain letters and spaces",
        }),
      };
    }

    const addressRegex = /^[A-Za-z0-9\s,.'-]+$/; 

    if (!addressRegex.test(address)) {
      console.log("Invalid address format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid address format! Address should only contain letters, numbers, spaces, and common punctuation.",
        }),
      };
    }
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while updating the employer",
      }),
    };
  }
};
