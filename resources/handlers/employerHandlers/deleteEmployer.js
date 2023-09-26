const connectDB = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.deleteEmployer = async (event) => {
  console.log("Lambda fucntion invoked");

  try {
    await connectDB();

    const employerId = event.pathParameters.id;
    console.log("Employer Id", employerId);

    const deleteEmployer = await Employer.findByIdAndRemove(employerId);
    if (!deleteEmployer) {
      console.log("Employer not found");
      return Responses._404({
        status: "error",
        message: "Employer is not found",
      });
    }

    console.log("Employer deleted successfully");

    return Responses._200({
      status: "success",
      message: "Employer deleted sucessfully",
    });
  } catch (error) {
    console.log("An error happened", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while retreiving the employer, check the logs for more information",
    });
  }
};
