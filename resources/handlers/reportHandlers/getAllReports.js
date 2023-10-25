const { connectDB } = require("../../config/dbConfig");
const Report = require("../../models/reportModel");
const Responses = require("../../handlers/apiResponses");

module.exports.getAllReports = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const reports = Report.find({})
      .populate("reportedBy")
      .populate("userBeingReported")
      .lean();

    if (!reports) {
      console.log("No reports found");
      return Responses._404({
        status: "error",
        message: "No reports found",
      });
    }

    console.log("Reports fetched successfully");

    return Responses._200({message: "Report retreived successfully", reports});

  } catch (error) {
    console.log("Error happened", error);
    return Responses._500({
      message: "Something bad happened check the logs for more information",
    });
  }
};
