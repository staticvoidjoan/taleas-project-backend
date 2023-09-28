const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();
const Responses = require("../apiResponses");

module.exports.updateEmployer = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();

    const {address, profilePhoto } = JSON.parse(
      event.body
    );
    console.log("Received data", event.body);

    const employerId = event.pathParameters.id;
    const employer = await Employer.findOne({ _id: employerId });
    console.log("Employer email", employerId);

    if (!employer) {
      console.log("Employer not found");
      return Responses._404({
        status: "error",
        message: "Employer is not found anywhere",
      });
    }

    const bucketName = "employerprofileimagebucket";
    if (employer.profilePhoto !== undefined) {
      const deleteParams = {
        Bucket: bucketName,
        Key: employer.profilePhoto,
      };
      try {
        await s3.deleteObject(deleteParams).promise();
      } catch (error) {
        console.log(
          "An error occurred while deleting the old image from s3",
          error
        );
      }
    }

    const invokeParams = {
      FunctionName:
        "TaleasProjectBackendStack-UploadImageuploadImage1A-cxRbW8qlYfWs",
      Payload: JSON.stringify({ profilePhoto, bucketName }),
    };
    const invokeResult = await lambda.invoke(invokeParams).promise();
    const uploadResult = JSON.parse(invokeResult.Payload);
    console.log(uploadResult);

    const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;

    if (!addressRegex.test(address)) {
      console.log("Invalid address format");
      return Responses._400({
        status: "error",
        message:
          "Invalid address format. Address can only contain letters, numbers, spaces, and the following special characters: , . ' -",
      });
    }
    
    employer.address = address;
    employer.profilePhoto = uploadResult.body;

    const updatedEmployer = await employer.save();

    console.log("Employer updated successfully", updatedEmployer);
    return Responses._200({
      status: "success",
      message: "Employer updated successfully",
      employer,
    });
  } catch (error) {
    console.log("An error happened", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while updating the employer, check the logs for more information",
    });
  }
};
