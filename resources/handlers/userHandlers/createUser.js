const { connectDB } = require("../config/databaseConfig");
const User = require("../models/userModel");

module.exports.createUser = async (event, context) => {
  console.log(JSON.stringify(event));
  context.callbackWaitsForEmptyEventLoop = false;
  await connectDB();
  try {
    const stringJsonBody = event.body;
    const { name, lastname, email } = JSON.parse(stringJsonBody);

    if (!name || !lastname || !email) {
      console.log("Please provide all the required fields");
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          status: "error",
          error: "Please provide all the required fields",
        }),
      };
    }
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

    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegEx.test(email)) {
      console.log("Email is not valid");
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          status: "error",
          message: "Email is not valid",
        }),
      };
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      console.log("Email already exists");
      return {
        statusCode: 409,
        body: JSON.stringify({
          error:
            "Email already exists! Try a different one or try to login to your account.",
        }),
      };
    }

    const user = new User({
      name,
      lastname,
      email,
    });
    await user.save();

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
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
        message: "An error occurred while registerin the user",
      }),
    };
  }
};
