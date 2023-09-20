const {connectDB} = require('../../config/dbConfig');
const User = require('../../models/userModel');
const Education = require('../../models/educationModel');
const Experience = require('../../models/experienceModel')
const Certifications = require('../../models/Certifications')

module.exports.completeProfile = async (event, context) => {
    console.log(JSON.stringify(event));
    context.callbackWaitsForEmptyEventLoop = false;
    await connectDB();
    try {
      const stringJsonBody = event.body;
      const {education, experience, generalSkills, languages, certifications, links} = JSON.parse(stringJsonBody);
        const user = User.findOne({name : name, lastname : lastname})
            // Create education, experience, certifications data
            const educationDocuments = await Education.create(education);
        
            const experienceDocuments = await Experience.create(experience);
       
            const certificationsDocuments = await Certifications.create(
              certifications
            );
        
            // Update user document and associate with education, experience, and certifications
              user.education = educationDocuments.map((edu) => edu._id)
              user.experience =  experienceDocuments.map((exp) => exp._id)
              user.certifications = certificationsDocuments.map((cert) => cert._id)
              user.generalSkills = userData.generalSkills
              user.languages = userData.languages
              user.links = userData.links
        
            // Save the user document
            const updatedUser = await user.save();
        
            return {
              statusCode: 200,
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
              },
              body: JSON.stringify({ message: "User updated successfully" }),
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