const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Certifications = require("../../models/certeficationsModel");

module.exports.deleteCertification = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const certificationId = event.pathParameters.id;
    const certification = await Certifications.findById(certificationId);
    if (!certification) {
        console.log('Certification not found')
        return{
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ error: "Certification not found" })
        }
      }
  
      // Remove the certification's ID from the user education array
      await User.findOneAndUpdate({ certifications: certificationId }, { $pull: { certifications: certificationId } });
  
      await Certifications.findByIdAndDelete(certificationId);
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
          message: "An error while deleting certification",
        }),
      };
    }
}