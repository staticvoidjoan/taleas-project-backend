const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.lambdaTrigger = async (event) => {
  console.log("Lambda functions is triggered");
  await connectDB();

  try {
    if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
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
          console.log("I AM A USER BEING REGISTERED");
          if (!nameRegEx.test(name)) {
            console.log("Name should be at least 2 characters long");
            throw new Error("Name should be at least 2 characters long");
          }

          if (!nameRegEx.test(lastname)) {
            console.log("Lastname should be at least 2 characters long");
            throw new Error("Lastname dshould be at least 2 characters long");
          }

          if (!emailRegEx.test(email)) {
            console.log("Email is not valid");
            throw new Error("Email is not valid");
          }

          const existingUser = await User.findOne({ email: email });
          if (existingUser) {
            console.log("Email already exists");
            throw new Error("Email already exists");
          }

          const user = new User({
            name,
            lastname,
            email,
          });

          await user.save();
          console.log("User saved to the database", user);
          console.log("Is mployee: ", isEmployee);
        } else {
          console.log("I AM A COMPANY BEING REGISTERED");
          var companyName = event.request.userAttributes["given_name"];
          var email = event.request.userAttributes["email"];

          // Add your validation logic here
          const nameRegEx = /^[A-Za-z0-9\s. ']{3,30}$/;
          const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


          if (!nameRegEx.test(companyName)) {
            console.log("Company name should be at least 3 characters long");
            throw new Error("Company name should be at least 3 characteres long ");
          }

          if (!emailRegEx.test(email)) {
            console.log("Email is not valid");
            throw new Error("Email is not valid");
          }

          const existingEmployer = await Employer.findOne({ email: email });
          if (existingEmployer) {
            console.log("Email already exists");
            throw new Error("Email already exists");
          }

          const newEmployer = new Employer({
            companyName,
            email,
          });

          await newEmployer.save();
          console.log("Employer saved to the database", newEmployer);
        }
      }
    } else if (event.trigger === "PreAuthentication_Authentication") {
      console.log("Password received");
    }
  } catch (error) {
    console.error("An error happened", error);
    throw error;
  }

  return event;
};
