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
    } = JSON.parse(event.body);
    
    const email = event.pathParameters.email;
    const user = await User.findOne({ email: email });
    // Create education, experience, certifications data
    const educationDocuments = await Education.create(education);

    const experienceDocuments = await Experience.create(experience);

    const certificationsDocuments = await Certifications.create(certifications);

    // Update user document and associate with education, experience, and certifications
    user.education = educationDocuments.map((edu) => edu._id);
    user.experience = experienceDocuments.map((exp) => exp._id);
    user.certifications = certificationsDocuments.map((cert) => cert._id);
    user.generalSkills = generalSkills;
    user.languages = languages;
    user.links = links;

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
