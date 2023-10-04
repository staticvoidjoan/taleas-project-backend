const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Education = require("../../models/educationModel");
const Responses = require("../apiResponses");

module.exports.deleteEducation = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const id = event.pathParameters.id;
    const education = await Education.findById(id);
    if (!education) {
      console.log("Education not found");
      return Responses._404({ error: "Education not found" });
    }

    // Remove the education's ID from the user education array
    await User.findOneAndUpdate(
      { education: id },
      { $pull: { education: id } }
    );

    await Education.findByIdAndDelete(id);
    return Responses._200({
      status: "success",
      message: "Deleted successfully",
    });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred deleting education",
    });
  }
};
