const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const User = require("../../models/userModel");
const Report = require("../../models/reportModel");
const Responses = require("../../handlers/apiResponses");

module.exports.reportUser = async (event) => {
    console.log("Lambda function invoked");
    await connectDB();
  
    try {
      const { reportedBy, userBeingReported, reportReason } = JSON.parse(
        event.body
      );
      console.log("Event body: ", event.body);
  
      const existingUser = await User.findById(userBeingReported);
      console.log("User id", userBeingReported);
  
      if (!existingUser) {
        console.log("User is not found anywhere");
        return Responses._404({
          status: "error",
          message: "User is not found anywhere",
        });
      }
  
      const existingEmployer = await Employer.findById(reportedBy);
      console.log("Employer id", reportedBy);
  
      if (!existingEmployer) {
        console.log("Employer is not found anywhere");
        return Responses._404({
          status: "error",
          message: "Employer is not found anywhere",
        });
      }
  
      existingUser.reportCount += 1;
      await existingUser.save();
  
      const existingReport = await Report.findOne({
        reportedBy: reportedBy,
        userBeingReported: userBeingReported,
      });
  
      let existingReportBool = false;
      if (existingReport) {
        existingReportBool = true;
        return Responses._400({
          message: "You have already reported this user",
        });
      }
  
      if (!reportReason) {
        return Responses._400({ message: "Report reason is required" });
      }
  
      const newReport = new Report({
        reportedBy: reportedBy,
        userBeingReported: userBeingReported,
        reportReason: reportReason,
      });
  
      await newReport.save();
  
      existingEmployer.blockedUsers.push(userBeingReported);
      await existingEmployer.save();
      console.log("User has been blocked");
  
      return Responses._200({ message: "User report submitted successfully" });
    } catch (error) {
      console.log("An error happened: ", error);
      return Responses._500({
        message: "Error occurred check the logs for more",
      });
    }
  };
  