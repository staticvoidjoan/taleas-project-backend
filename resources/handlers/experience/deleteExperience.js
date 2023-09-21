const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Experience = require("../../models/experienceModel");

module.exports.deleteExperience = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const experienceId = event.pathParameters.id;
    const experience = await Experience.findById(experienceId);
    if (!experience) {
        console.log('Experience not found')
        return{
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: "Experience not found" })
        }
      }
  
      // Remove the education's ID from the user education array
      await User.findOneAndUpdate({ experience: experienceId }, { $pull: { experience: experienceId } });
  
      await Experience.findByIdAndDelete(experienceId);
    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "success", message: "Deleted successfully" }),
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
          message: "An error while deleting experience",
        }),
      };
    }
}