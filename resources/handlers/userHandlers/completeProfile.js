const {connectDB} = require('../../config/dbConfig');
const User = require('../../models/userModel');
const Education = require('../../models/educationModel');
const Experience = require('../../models/experienceModel');
const Certifications = require('../../models/certificationsModel');

module.exports.completeProfile = async (event, context) =>{
    context.callbackWaitsForEmptyEventLoop = false; 

    await connectDB();

    try{
    const name = event.path.parameters.name;
    const user = await User.findOne({name: name});
    const {education, experience, generalSkills, languages, certifications, links} = JSON.parse(stringJsonBody);

    if (!mongoose.Types.ObjectId.isValid(education)) {
        console.log('Provided education id is not Mongo Obejct Id');
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "Invalid education Id" }),
        };
      }

      if (!mongoose.Types.ObjectId.isValid(experience)) {
        console.log('Provided experience id is not Mongo Obejct Id');
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "Invalid experience Id" }),
        };
      }

      if (!mongoose.Types.ObjectId.isValid(certifications)) {
        console.log('Provided certifications id is not Mongo Obejct Id');
        return {
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "Invalid certifications Id" }),
        };
      }

      const linkRegEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
      links.map((link) => {
        if(!linkRegEx.test(link)){
            console.log('One of the provided links is not correct format');
            return{
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({status: "error", error: "One of provided links is not correct"})
            }
        }
      })

      user.education = education;
      user.experience = experience;
      user.certifications = certifications;
      user.languages = languages;
      user.generalSkills = generalSkills;
      user.links = links;

      const completedProfile = await user.save();
      return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({status: "success", error: "Profile completed successfully"})
    }
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
        message: "An error occurred while completing user profile",
      }),
    };
  }
}