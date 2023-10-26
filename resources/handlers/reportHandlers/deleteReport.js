const { connectDB } = require("../../config/dbConfig");
const Report = require("../../models/reportModel");
const Responses = require("../../handlers/apiResponses");

module.exports.deleteReport = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const reportId = event.pathParameters.id;
    console.log("Report id: ", reportId);

    const deletedReport = await Report.findByIdAndRemove(reportId);

    if (!deletedReport) {
      return Responses._404({ status: "error", message: "Report not found" });
    }

    console.log("Report successfully deleted");

    return Responses._200({
      message: "Report deleted successfully",
      deletedReport,
    });
  } catch (error) {
    console.log("Error happened", error);
    return Responses._500({
      message: "An error occurred check the logs for more information",
    });
  }
};
