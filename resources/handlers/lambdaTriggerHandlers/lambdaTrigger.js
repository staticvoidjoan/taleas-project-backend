const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.lambdaTrigger =  async (event, context, callback)  => {
  console.log("Lambda functions is triggered");
  await connectDB();

  try {
    if (event.request.userAttributes.hasOwnProperty("custom:isEmployee")) {
      var isEmployee = event.request.userAttributes["custom:isEmployee"];
      if (isEmployee === "true") {
        var name = event.request.userAttributes["given_name"];
        var lastname = event.request.userAttributes["family_name"];
        var email = event.request.userAttributes["email"];
        var dateOfBirth = event.request.userAttributes["birthdate"];

        // Add your validation logic here
        const nameRegEx = /^[a-zA-Z\s]{2,30}$/;
        const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegEx.test(name)) {
          console.log("Name contains invalid characters");
          callback(
            null,
            buildResponse(400, "Name does not contain valid characters")
          );
          return;
        }

        if (!nameRegEx.test(lastname)) {
          console.log("Lastname contains invalid characters");
          callback(
            null,
            buildResponse(400, "Name does not contain valid characters")
          );
          return;
        }

        if (!emailRegEx.test(email)) {
          console.log("Email is not valid");
          callback(null, buildResponse(400, "Email is not valid"));
          return;
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          console.log("Email already exists");
          callback(null, buildResponse(400, "Email already exists"));
          return;
        }

        const user = new User({
          name,
          lastname,
          email,
        });

        await user.save();
        console.log("User saved to the database", user);
        console.log("Is mployee: ", isEmployee);
        callback(null, buildResponse(200, "User created successfully"));
      } else {
        var companyName = event.request.userAttributes["given_name"];
        var email = event.request.userAttributes["email"];

        // Add your validation logic here
        const nameRegEx = /^[A-Za-z0-9\s.]+$/;
        const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegEx.test(companyName)) {
          console.log("Company name contains invalid characters");
          callback(null,buildResponse(400, "Company name does not contain valid characters"));
          return;
        }

        if (!emailRegEx.test(email)) {
          console.log("Email is not valid");
          callback(null, buildResponse(400, "Email is not valid"));
          return;
        }

        const existingEmployer = await Employer.findOne({ email: email });
        if (existingEmployer) {
          console.log("Email already exists");
          callback(null, buildResponse(400, ""));
          return;
        }

        const newEmployer = new Employer({
          companyName,
          email,
        });

        await newEmployer.save();
        console.log("Employer saved to the database", newEmployer);
        console.log("Is employee: ", isEmployee);
        callback(null, buildResponse(200, "Employer created successfully"));
      }
    }
  } catch (error) {
    console.error("An error happened", error);
    callback(error);
  }

  return event;
};

function buildResponse(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({
      status: statusCode >= 200 && statusCode < 300 ? "success" : "error",
      message: message,
    }),
  };
}
