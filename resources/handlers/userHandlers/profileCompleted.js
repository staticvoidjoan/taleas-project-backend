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
      console.log("Headline must be alphanumeric.");
      return Responses._400({
        error: "Headline must be alphanumeric.",
      });
    }

    if (education && education.length > 0) {
      education.map((edu) => {
        if (!textRegex.test(edu.institution) || !textRegex.test(edu.degree)) {
          console.log("Institution and degree must be alphanumeric.");
          return Responses._400({
            error: "Institution and degree must be alphanumeric.",
          });
        }

        if (
          !dateRegex.test(edu.startDate) ||
          (edu.endDate && !dateRegex.test(edu.endDate))
        ) {
          console.log("Start date and end date must be in YYYY-MM-DD format.");
          return Responses._400({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          });
        }
       });
      }
      const educationDocuments = []; // Initialize an empty array

      if (education && education.length > 0) {
        await Promise.all(
          education.map(async (edu) => {
            if (edu.degree || edu.institution || edu.startDate) {
              if (edu._id) {
                const updatedEducation = await Education.findByIdAndUpdate(
                  edu._id,
                  edu,
                  { new: true }
                );
                educationDocuments.push(updatedEducation);
              } else {
                const newEducation = await Education.create(edu);
                educationDocuments.push(newEducation);
              }
            }
          })
        );
      }

    // Validate employer and position fields
    if (experience && experience.length > 0) {
      experience.map((exp) => {
        if (!exp.employer || !exp.position) {
          console.log("Employer and position are required.");
          return Responses._400({
            error: "Employer and position are required.",
          });
        }

        if (!textRegex.test(exp.employer) || !textRegex.test(exp.position)) {
          console.log("Employer and position must be alphanumeric.");
          return Responses._400({
            error: "Employer and position must be alphanumeric.",
          });
        }

        if (!exp.startDate) {
          console.log("Start date is required.");
          return Responses._400({ error: "Start date is required." });
        }

        if (
          !dateRegex.test(exp.startDate) ||
          (exp.endDate && !dateRegex.test(exp.endDate))
        ) {
          console.log("Start date and end date must be in YYYY-MM-DD format.");
          return Responses._400({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          });
        }

        if (!textRegex.test(exp.description)) {
          return Responses._400({ error: "Description is required." });
        }
      });
    }

    const experienceDocuments = []; // Initialize an empty array

    if (experience && experience.length > 0) {
      await Promise.all(
        experience.map(async (exp) => {
          if (exp.position || exp.employer || exp.startDate) {
            if (exp._id) {
              const updatedExperience = await Experience.findByIdAndUpdate(
                exp._id,
                exp,
                { new: true }
              );
              experienceDocuments.push(updatedExperience);
            } else {
              const newExperience = await Experience.create(exp);
              experienceDocuments.push(newExperience);
            }
          }
        })
      );
    }

    // Validate certifications fields
    if (certifications && certifications.length > 0) {
      certifications.map((cert) => {
        if (!textRegex.test(cert.title) || !textRegex.test(cert.organization)) {
          console.log("Title and issuing organization must be alphanumeric.");
          return Responses._400({
            error: "Title and issuing organization must be alphanumeric.",
          });
        }

        if (
          !dateRegex.test(cert.issueDate) ||
          (cert.expirationDate && !dateRegex.test(cert.expirationDate))
        ) {
          console.log(
            "Issue date and expiration date must be in YYYY-MM-DD format."
          );
          return Responses._400({
            error:
              "Issue date and expiration date must be in YYYY-MM-DD format.",
          });
        }
      });
    }

    const certificationDocuments = []; // Initialize an empty array

    if (certifications && certifications.length > 0) {
      await Promise.all(
        certifications.map(async (cert) => {
          if (cert.title || cert.organization || cert.issueDate) {
            if (cert._id) {
              const updatedCertification =
                await Certifications.findByIdAndUpdate(cert._id, cert, {
                  new: true,
                });
              certificationDocuments.push(updatedCertification);
            } else {
              const newCertification = await Certifications.create(cert);
              certificationDocuments.push(newCertification);
            }
          }
        })
      );
    }
    // Validate generalSkills, languages, and links fields
    if (generalSkills && generalSkills.length > 0) {
      generalSkills.map((skill) => {
        if (!textRegex.test(skill)) {
          console.log("General skills must be alphanumeric.");
          return Responses._400({
            error: "General skills must be alphanumeric.",
          });
        }
      });
    }
    if (languages && languages.length > 0) {
      languages.map((language) => {
        if (!textRegex.test(language)) {
          console.log("Languages must be alphanumeric.");
          return Responses._400({
            error: "Languages must be alphanumeric.",
          });
        }
      });
    }
    if (links && links.length > 0) {
      links.map((link) => {
        if (!urlRegex.test(link)) {
          console.log("Links must be valid URLs.");
          return Responses._400({ error: "Links must be valid URLs." });
        }
      });
    }
    // Update user document and associate with education, experience, and certifications
    user.name = name;
    user.lastname = lastname;
    user.headline = headline;
    user.education = educationDocuments.map((edu) => (edu._id ? edu._id : edu));
    user.experience = experienceDocuments.map((exp) =>
      exp._id ? exp._id : exp
    );
    user.certifications = certificationDocuments.map((cert) =>
      cert._id ? cert._id : cert
    );
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
