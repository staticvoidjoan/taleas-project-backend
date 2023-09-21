const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Experience = require("../../models/experienceModel");
const Certifications = require("../../models/certeficationsModel");

module.exports.updateUser = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
    try {
      await connectDB();
      const {
        name,
        lastname,
        education,
        experience,
        certifications,
        generalSkills,
        languages,
        links,
      } = JSON.parse(event.body);
      
      const email = event.pathParameters.email;
      const user = await User.findOne({ email: email });

      if(!user){
        console.log('User not found');
        return {
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({status: "error", error: "User not found" }),
          };
      }

      //Validations
      const nameRegEx = /^[a-zA-Z]{2,30}$/;
    if (!nameRegEx.test(name)) {
      console.log("Name contains invalid characters");
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "error", message: "Name is not valid" }),
      };
    }

    if (!nameRegEx.test(lastname)) {
      console.log("Last name contains invalid characters");
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "error", message: "Name is not valid" }),
      };
    }

    if (education && education.length > 0) {
        const edu = await Education.find({ _id: { $in: education } });
    
        if (edu.length !== education.length) {
          console.log('Provided educations Ids are not correct')
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                  },
                body: JSON.stringify({status: "error", error: "Provided education Ids are not correct" }),
            };
        }
    }

    if (experience && experience.length > 0) {
        const exp = await Experience.find({ _id: { $in: experience } });
    
        if (exp.length !== experience.length) {
          console.log('Provided experiences Ids are not correct')
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                  },
                body: JSON.stringify({status: "error", error: "Provided experiences Ids are not correct" }),
            };
        }
    }

    if (certifications && certifications.length > 0) {
        const cert = await Certifications.find({ _id: { $in: certifications } });
    
        if (cert.length !== certifications.length) {
          console.log('Provided certifications Ids are not correct')
            return {
                statusCode: 404,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                  },
                body: JSON.stringify({status: "error", error: "Provided certifications Ids are not correct" }),
            };
        }
    }
    
    const linksRegEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    links.map((link) => {
        if(!linksRegEx.test(link)){
            console.log('Provided link is not correct')
            return {
                statusCode: 400,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                  },
                body: JSON.stringify({status: "error", error: "Provided link is not correct" }),
            };
        }
    })

    user.name = name;
    user.lastname = lastname;
    user.education = education;
    user.experience = experience;
    user.certifications = certifications;
    user.generalSkills = generalSkills;
    user.languages = languages;
    user.links = links;

    // Save the updated user document
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
        message: "An error occurred while updating the user",
      }),
    };
  }
}