const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");

module.exports.deleteEducation = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const id = event.pathParameters.id;
    const education = await Education.findById(id);
    if (!education) {
      console.log('Education not found')
      return{
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ error: "Education not found" })
      }
    }

    // Remove the education's ID from the user education array
    await User.findOneAndUpdate({ education: id }, { $pull: { education: id } });

    await Education.findByIdAndDelete(id);
    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({status: "success", message: "Deleted successfully"}),
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
          message: "An error occurred deleting education",
        }),
      };
    }
  };
