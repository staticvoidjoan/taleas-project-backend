const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.lambdaTrigger = async (event) => {
  console.log("Lambda functions is triggered");
  await connectDB();

  try {
    if (event.request.userAttributes.hasOwnProperty("custom:isEmployee")) {
      var isEmployee = event.request.userAttributes["custom:isEmployee"];
      if (isEmployee === "true") {
        var name = event.request.userAttributes["given_name"];
        var lastname =  event.request.userAttributes["family_name"];
        var email = event.request.userAttributes["email"];
        var dateOfBirth = event.request.userAttributes["birthdate"];

        // Add your validation logic here
        const nameRegEx = /^[a-zA-Z\s]{2,30}$/;
        const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegEx.test(name)) {
          console.log("Full name contains invalid characters");
          return Responses._400({
            status: "error",
            message: "Full name is not valid",
          });
        }

        if (!nameRegEx.test(lastname)) {
          console.log("Full name contains invalid characters");
          return Responses._400({
            status: "error",
            message: "Full name is not valid",
          });
        }

        if (!emailRegEx.test(email)) {
          console.log("Email is not valid");
          return Responses._400({
            status: "error",
            message: "Email is not valid",
          });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          console.log("Email already exists");
          return Responses._400({
            status: "error",
            message: "Email already exists! Try another one.",
          });
        }

        const user = new User({
          name,
          lastname,
          email,
        });

        await user.save();
        console.log("User saved to the database", user);
        console.log("Is mployee: ", isEmployee);

        return Responses._200({
          status: "success",
          message: "User created successfully",
          user,
        });
      } else {
        var companyName = event.request.userAttributes["given_name"];
        var email = event.request.userAttributes["email"];

        // Add your validation logic here
        const nameRegEx = /^[A-Za-z0-9\s.]+$/;
        const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!nameRegEx.test(companyName)) {
          console.log("Company name contains invalid characters");
          return Responses._400({
            status: "error",
            message: "Company name is not valid",
          });
        }

        if (!emailRegEx.test(email)) {
          console.log("Email is not valid");
          return Responses._400({
            status: "error",
            message: "Email is not valid",
          });
        }

        const existingEmployer = await Employer.findOne({ email: email });
        if (existingEmployer) {
          console.log("Email already exists");
          return Responses._400({
            status: "error",
            message: "Email already exists! Try another one.",
          });
        }

        const newEmployer = new Employer({
          companyName,
          email,
        });

        await newEmployer.save();
        console.log("Employer saved to the database", newEmployer);
        console.log("Is employee: ", isEmployee);

        return Responses._200({
          status: "success",
          message: "Employer created successfully",
          newEmployer,
        });
      }
    }
  } catch (e) {
    console.error(e);
    return Responses._500({
      status: "error",
      message: "An error occurred while creating the user or employer",
    });
  }

  return event;
};
