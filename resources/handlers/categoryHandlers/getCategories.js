const { connectDB } = require("../../config/dbConfig");
const Category = require("../../models/categoryModel");
const Responses = require("../apiResponses");

module.exports.getCategories = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const categories = await Category.find();
    if (!categories) {
      console.log("No category found");
      return Responses._404({ status: "error", error: "No category found" });
    }

    return Responses._200({status:"success", categories });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while getting the user",
    });
  }
};
