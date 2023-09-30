const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");
const AWS = require("aws-sdk");
const lambda = new AWS.Lambda();
const Responses = require("../apiResponses");

module.exports.profileComplete = async (event, context) => {
  console.log(JSON.stringify(event));
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

    const bucketName = "userprofilephotobucket";
    const invokeParams = {
      FunctionName:
        "TaleasProjectBackendStack-UploadImageuploadImage1A-cxRbW8qlYfWs",
      Payload: JSON.stringify({ profilePhoto, bucketName }),
    };
    const invokeResult = await lambda.invoke(invokeParams).promise();
    const uploadResult = JSON.parse(invokeResult.Payload);
    console.log(uploadResult);

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,.'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const urlRegex =
      /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    // Validate education fields
    if (!textRegex.test(headline)) {
      return Responses._400({
        error: "Headline must be alphanumeric.",
      });
    }

    if (education.length > 0) {
      education.map((edu) => {
        if (!textRegex.test(edu.institution) || !textRegex.test(edu.degree)) {
          return Responses._400({
            error: "Institution and degree must be alphanumeric.",
          });
        }

        if (
          !dateRegex.test(edu.startDate) ||
          (edu.endDate && !dateRegex.test(edu.endDate))
        ) {
          return Responses._400({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          });
        }
      });
    }
    const educationDocuments = await Promise.all(
      education.map(async (edu) => {
        if (edu._id) {
          // If _id exists, update the document
          return await Education.findByIdAndUpdate(edu._id, edu, { new: true });
        } else {
          // If _id does not exist, create a new document
          return await Education.create(edu);
        }
      })
    );

    // Validate employer and position fields
    if (experience.length > 0) {
      experience.map((exp) => {
        if (!exp.employer || !exp.position) {
          return Responses._400({
            error: "Employer and position are required.",
          });
        }

        if (!textRegex.test(exp.employer) || !textRegex.test(exp.position)) {
          return Responses._400({
            error: "Employer and position must be alphanumeric.",
          });
        }

        // Validate start date and end date fields
        if (!exp.startDate) {
          return Responses._400({ error: "Start date is required." });
        }

        if (
          !dateRegex.test(exp.startDate) ||
          (exp.endDate && !dateRegex.test(exp.endDate))
        ) {
          return Responses._400({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          });
        }

        // Validate description field
        if (!exp.description) {
          return Responses._400({ error: "Description is required." });
        }

        if (!textRegex.test(exp.description)) {
          return Responses._400({ error: "Description is required." });
        }
      });
    }
    
    const experienceDocuments = await Promise.all(
      experience.map(async (exp) => {
        if (exp._id) {
          return await Experience.findByIdAndUpdate(exp._id, exp, { new: true });
        } else {
          return await Experience.create(exp);
        }
      })
    );

    if (certifications.length > 0) {
      certifications.map((cert) => {
        if (!cert.title || !cert.organization || !cert.startDate) {
          return Responses._400({
            error: "Title, organization and startDate are required.",
          });
        }

        if (!textRegex.test(cert.title) || !textRegex.test(cert.organization)) {
          return Responses._400({
            error: "Title and issuing organization must be alphanumeric.",
          });
        }

        if (
          !dateRegex.test(cert.issueDate) ||
          (cert.expirationDate && !dateRegex.test(cert.expirationDate))
        ) {
          return Responses._400({
            error:
              "Issue date and expiration date must be in YYYY-MM-DD format.",
          });
        }
      });
    }
    
    const certificationDocuments = await Promise.all(
      certifications.map(async (cert) => {
        if (cert._id) {
          return await Certifications.findByIdAndUpdate(cert._id, cert, { new: true });
        } else {
          return await Certifications.create(cert);
        }
      })
    );

    // Validate generalSkills, languages, and links fields
    if (generalSkills.length > 0) {
      generalSkills.map((skill) => {
        if (!textRegex.test(skill)) {
          return Responses._400({
            error: "General skills must be alphanumeric.",
          });
        }
      });
    }
    if (languages.length > 0) {
      languages.map((language) => {
        if (!textRegex.test(language)) {
          return Responses._400({
            error: "Languages must be alphanumeric.",
          });
        }
      });
    }
    if (links.length > 0) {
      links.map((link) => {
        if (!urlRegex.test(link)) {
          return Responses._400({ error: "Links must be valid URLs." });
        }
      });
    }
    // Update user document and associate with education, experience, and certifications
    user.name = name;
    user.lastname = lastname
    user.headline = headline;
    user.education = educationDocuments.map((edu) => edu._id);
    user.experience = experienceDocuments.map((exp) => exp._id);
    user.certifications = certificationDocuments.map((cert) => cert._id);
    user.generalSkills = generalSkills;
    user.languages = languages;
    user.links = links;
    user.profilePhoto = uploadResult.body;

    // Save the user document
    const updatedUser = await user.save();

    return Responses._200({ status: "success", updatedUser });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while registerin the user",
    });
  }
};
