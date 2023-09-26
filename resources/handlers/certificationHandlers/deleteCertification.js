const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Certifications = require("../../models/certeficationsModel");
const Responses = require("../apiResponses");

module.exports.deleteCertification = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const certificationId = event.pathParameters.id;
    const certification = await Certifications.findById(certificationId);
    if (!certification) {
      console.log("Certification not found");
      return Responses._404({ error: "Certification not found" });
    }

    // Remove the certification's ID from the user education array
    await User.findOneAndUpdate(
      { certifications: certificationId },
      { $pull: { certifications: certificationId } }
    );

    await Certifications.findByIdAndDelete(certificationId);
    return Responses._200({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error while deleting certification",
    });
  }
};
