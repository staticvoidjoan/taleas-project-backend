const { connectDB } = require("../../config/dbConfig");
const Category = require("../../models/categoryModel");

module.exports.getCategories = async (event, context) => {
    context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const categories = await Category.find();
    if (!categories) {
      console.log("No category found");
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ status: "error", error: "No category found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(categories),
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
        message: "An error occurred while getting the user",
      }),
    };
  }
};
