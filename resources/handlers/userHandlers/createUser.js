const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Responses = require("../apiResponses");

module.exports.createUser = async (event, context) => {
  console.log(JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  try {
    const stringJsonBody = event.body;
    const { name, lastname, email } = JSON.parse(stringJsonBody);

    if (!name || !lastname || !email) {
      console.log("Please provide all the required fields");
      return Responses._400({
        status: "error",
        error: "Please provide all the required fields",
      });
    }

    const nameRegEx = /^[a-zA-Z]{2,30}$/;
    if (!nameRegEx.test(name)) {
      console.log("Name contains invalid characters");
      return Responses._400({ status: "error", message: "Name is not valid" });
    }

    if (!nameRegEx.test(lastname)) {
      console.log("Last name contains invalid characters");
      return Responses._400({ status: "error", message: "Name is not valid" });
    }

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      console.log("Email is not valid");
      return Responses._404({
        status: "error",
        message: "Email is not valid",
      });
    }

    const existingEmail = await User.findOne({ email: email });
    if (existingEmail) {
      console.log("Email already exists");
      return Responses._409({
        error:
          "Email already exists! Try a different one or try to login to your account.",
      });
    }

    const user = new User({
      name,
      lastname,
      email,
    });
    await user.save();
    console.log("User created successfully");
    return Responses._409({ status: "success", user });
  } catch (error) {
    console.error("Something went wrong", error);
    return Responses._500({
      status: "error",
      message: "An error occurred while registerin the user",
    });
  }
};
