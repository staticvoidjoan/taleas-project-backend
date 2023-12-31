const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const User = require("../../models/userModel");
const Report = require("../../models/reportModel");
const Responses = require("../../handlers/apiResponses");

module.exports.createReport = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const { reportedBy, userBeingReported, reportReason } = JSON.parse(
      event.body
    );
    console.log("Event body: ", event.body);

    const existingEmployer = await Employer.findById(userBeingReported);
    console.log("Employer id", userBeingReported);

    if (!existingEmployer) {
      console.log("Employer is not found anywhere");
      return Responses._404({
        status: "error",
        message: "Employer is not found anywhere",
      });
    }

    if (existingEmployer.reportCount >= 10) {
      return Responses._400({
        message:
          "This company has been reported more than 10 times! Take actions now!",
      });
    }

    const existingUser = await User.findById(reportedBy);
    console.log("User id", reportedBy);

    if (!existingUser) {
      console.log("User is not found anywhere");
      return Responses._404({
        status: "error",
        message: "User is not found anywhere",
      });
    }



    existingEmployer.reportCount += 1;
    await existingEmployer.save();

    const existingReport = await Report.findOne({
      reportedBy: reportedBy,
      userBeingReported: userBeingReported,
    });

    let existingReportBool = false;
    if (existingReport) {
      existingReportBool = true;
      return Responses._400({
        message: "You have already reported this employer",
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

    existingUser.blockedCompanies.push(userBeingReported);
    await existingUser.save();
    console.log("Company has been blocked");

    return Responses._200({ message: "Report submitted successfully" });
  } catch (error) {
    console.log("An error happened: ", error);
    return Responses._500({
      message: "Error occurred check the logs for more",
    });
  }
};
