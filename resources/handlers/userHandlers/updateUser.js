const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const s3 = new AWS.S3();
const Responses = require("../apiResponses");

module.exports.updateUser = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const {
      name,
      lastname,
      headline,
      education,
      experience,
      certifications,
      generalSkills,
      languages,
      links,
      profilePhoto,
    } = JSON.parse(event.body);

    const userId = event.pathParameters.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      console.log("User not found");
      return Responses._404({ status: "error", message: "User not found" });
    }

    const bucketName = "userprofilephotobucket";
    //Delete previous profile photo
    if (user.profilePhoto !== undefined) {
      const deleteParams = {
        Bucket: bucketName,
        Key: user.profilePhoto,
      };
      try {
        await s3.deleteObject(deleteParams).promise();
      } catch (err) {
        console.log("Error deleting old profile photo from S3", err);
        throw err;
      }
    }
    console.log("Invoke function");
    const invokeParams = {
      FunctionName:
        "TaleasProjectBackendStack-UploadImageuploadImage1A-cxRbW8qlYfWs",
      Payload: JSON.stringify({ profilePhoto, bucketName }),
    };
    const invokeResult = await lambda.invoke(invokeParams).promise();
    const uploadResult = JSON.parse(invokeResult.Payload);
    console.log(uploadResult);

    //Validations
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const nameRegEx = /^[a-zA-Z]{2,30}$/;
    if (!nameRegEx.test(name)) {
      console.log("Name contains invalid characters");
      return Responses._400({ status: "error", message: "Name is not valid" });
    }

    if (!nameRegEx.test(lastname)) {
      console.log("Last name contains invalid characters");
      return Responses._400({ status: "error", message: "Name is not valid" });
    }

    if (!nameRegEx.test(headline)) {
      console.log("Headline contains invalid characters");
      return Responses._400({ status: "error", message: "Headline is not valid" });
    }

    if (education && education.length > 0) {
      const edu = await Education.find({ _id: { $in: education } });

      if (edu.length !== education.length) {
        console.log("Provided educations Ids are not correct");
        return Responses._400({
          status: "error",
          error: "Provided education Ids are not correct",
        });
      }
    }

    if (experience && experience.length > 0) {
      const exp = await Experience.find({ _id: { $in: experience } });

      if (exp.length !== experience.length) {
        console.log("Provided experiences Ids are not correct");
        return Responses._400({
          status: "error",
          error: "Provided experiences Ids are not correct",
        });
      }
    }

    if (certifications && certifications.length > 0) {
      const cert = await Certifications.find({ _id: { $in: certifications } });

      if (cert.length !== certifications.length) {
        console.log("Provided certifications Ids are not correct");
        return Responses._400({
          status: "error",
          error: "Provided certifications Ids are not correct",
        });
      }
    }

    generalSkills.map((skill) => {
      if (!textRegex.test(skill)) {
        return Responses._400({
          error: "General skills must be alphanumeric.",
        });
      }
    });

    languages.map((language) => {
      if (!textRegex.test(language)) {
        return Responses._400({
          error: "Languages must be alphanumeric.",
        });
      }
    });

    const linksRegEx =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    links.map((link) => {
      if (!linksRegEx.test(link)) {
        console.log("Provided link is not correct");
        return Responses._200({
          status: "error",
          error: "Provided link is not correct",
        });
      }
    });

    user.name = name;
    user.lastname = lastname;
    user.headline = headline;
    user.education = education;
    user.experience = experience;
    user.certifications = certifications;
    user.generalSkills = generalSkills;
    user.languages = languages;
    user.links = links;
    user.profilePhoto = uploadResult.body;

    // Save the updated user document
    const updatedUser = await user.save();

    return Responses._200({
      status: "success",
      updatedUser,
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while updating the user",
    });
  }
};
