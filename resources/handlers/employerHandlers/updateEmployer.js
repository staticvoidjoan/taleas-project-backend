const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();

module.exports.updateEmployer = async (event) => {
  console.log("Lambda function invoked");

  try {
    await connectDB();
    console.log("Connected to the database");

    const { companyName, address, industry, profilePhoto } = JSON.parse(
      event.body
    );
    console.log("Received data", event.body);

    const employerId = event.pathParameters.id;
    const employer = await Employer.findOne({ _id: employerId });
    console.log("Employer email", employerId);

    if (!employer) {
      console.log("Employer not found");
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "Employer not found" }),
      };
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

    const industryEnum = [
      "IT",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
    ];
    const industryNameRegex = /^[A-Za-z\s]+$/;

    if (!industryNameRegex.test(industry) || !industryEnum.includes(industry)) {
      console.log("Invalid industry");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid industry! Industry should only contain letters and symbols, and it must be one of the allowed industries: IT, Healthcare, Finance, Education, Manufacturing",
        }),
      };
    }

    employer.companyName = companyName;
    employer.address = address;
    employer.industry = industry;
    employer.profilePhoto = uploadResult.body;

    const updatedEmployer = await employer.save();

    console.log("Employer updated successfully", updatedEmployer);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedEmployer),
    };
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
