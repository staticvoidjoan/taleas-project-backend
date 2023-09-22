const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");

module.exports.profileComplete = async (event, context) => {
  console.log(JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const {
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

    const bucketName = "users";
      const invokeParams = {
        FunctionName: '', 
        Payload: JSON.stringify({ profilePhoto , bucketName }),
      };
      const invokeResult = await lambda.invoke(invokeParams).promise();
      const uploadResult = JSON.parse(invokeResult.Payload);
      console.log(uploadResult);

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

    // Validate education fields
    education.map((edu) => {
      if (!textRegex.test(edu.institution) || !textRegex.test(edu.degree)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Institution and degree must be alphanumeric.",
          }),
        };
      }

      if (
        !dateRegex.test(edu.startDate) ||
        (edu.endDate && !dateRegex.test(edu.endDate))
      ) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          }),
        };
      }
    });

    // Create education, experience, certifications data
    const educationDocuments = await Education.create(education);

    // Validate employer and position fields
    experience.map((exp) => {
      if (!exp.employer || !exp.position) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Employer and position are required.",
          }),
        };
      }

      if (!textRegex.test(exp.employer) || !textRegexRegex.test(exp.position)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Employer and position must be alphanumeric.",
          }),
        };
      }

      // Validate start date and end date fields
      if (!exp.startDate) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Start date is required." }),
        };
      }

      if (!dateRegex.test(exp.startDate) || (exp.endDate && !dateRegex.test(exp.endDate))) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Start date and end date must be in YYYY-MM-DD format.",
          }),
        };
      }

      // Validate description field
      if (!exp.description) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Description is required." }),
        };
      }

      if (!textRegex.test(exp.description)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Description is required." }),
        };
      }
    });

    const experienceDocuments = await Experience.create(experience);

    certifications.map((cert) => {
      if(!cert.title || !cert.organization || !cert.startDate ) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Title, organization and startDate are required.",
          }),
        };
      }
      if (!textRegex.test(cert.title) || !textRegex.test(cert.organization)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Title and issuing organization must be alphanumeric.",
          }),
        };
      }

      if (!dateRegex.test(cert.issueDate) || (cert.expirationDate && !dateRegex.test(cert.expirationDate))) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Issue date and expiration date must be in YYYY-MM-DD format.",
          }),
        };
      }
    })
    const certificationsDocuments = await Certifications.create(certifications);

    // Validate generalSkills, languages, and links fields
    generalSkills.map((skill) => {
      if (!textRegex.test(skill)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "General skills must be alphanumeric.",
          }),
        };
      }
    });

    languages.map((language) => {
      if (!textRegex.test(language)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({
            error: "Languages must be alphanumeric.",
          }),
        };
      }
    });

    links.map((link) => {
      if (!urlRegex.test(link)) {
        return {
          statusCode: 400,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true,
          },
          body: JSON.stringify({ error: "Links must be valid URLs." }),
        };
      }
    });

    // Update user document and associate with education, experience, and certifications
    user.education = educationDocuments.map((edu) => edu._id);
    user.experience = experienceDocuments.map((exp) => exp._id);
    user.certifications = certificationsDocuments.map((cert) => cert._id);
    user.generalSkills = generalSkills;
    user.languages = languages;
    user.links = links;
    user.profilePhoto = uploadResult.body;

    // Save the user document
    const updatedUser = await user.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(updatedUser),
    };
  } catch (error) {
    console.error("Something went wrong", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "error",
        message: "An error occurred while registerin the user",
      }),
    };
  }
};
