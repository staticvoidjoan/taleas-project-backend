const Employer = require('../../models/employerModel');
const Report = require("../../models/reportModel");
const Responses = require("../../handlers/apiResponses");
const {connectDB} = require('../../config/dbConfig');

module.exports.deleteReport = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const reportId = event.pathParameters.id;
    console.log("Report id: ", reportId);

    const report = await Report.findById(reportId);
    if (!report) {
      return Responses._404({ status: "error", message: "Report not found" });
    }

    await Employer.findByIdAndRemove(report.userBeingReported);

    const deletedReport = await Report.findByIdAndRemove(reportId);

    console.log("Report and company successfully deleted");

    return Responses._200({
      message: "Report and company deleted successfully",
      deletedReport,
    });
  } catch (error) {
    console.log("Error happened", error);
    return Responses._500({
      message: "An error occurred check the logs for more information",
    });
  }
};
