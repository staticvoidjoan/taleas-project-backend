const {connectDB} = require("../../config/dbConfig");
const Report = require("../../models/reportModel");
const Response = require("../../handlers/apiResponses");
const User = require('../../models/userModel');
const Employer = require('../../models/employerModel');

module.exports.getAllReports = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const reports = await Report.find()
      .populate("reportedBy", "name lastname email")
      .populate("userBeingReported", "companyName email");
    console.log("Reports: ", reports);

    return Response._200({ message: "Reports retreived successfully", reports});
  } catch (error) {
    console.log("Error happened", error);
    return Response._500({
      message: "An error happened check the logs for more",
    });
  }
};
