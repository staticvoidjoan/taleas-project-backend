const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");

module.exports.createEmployer = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { companyName, email, industry, address, subscriptionPlan } = data;

    if (!companyName || !email || !industry || !address) {
      console.log("All fields are required");
      return Responses._400({
        status: "error",
        message: "All fields are required",
      });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(companyName)) {
      console.log("Invalid name format");
      return Responses._400({
        status: "error",
        message:
          "Invalid company name format! Company name should only contain letters and symbols",
      });
    }

    const industryEnum = [
      "IT",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
    ];
    const industryNameRegex = /^[A-Za-z\s]+$/;

    if (!industryNameRegex.test(industry) || !industryEnum.includes(industry)) {
      console.log("Invalid industry");
      return Responses._400({
        status: "error",
        message:
          "Invalid industry field! Industry should be only from IT, Healthacare, Finance, Education and Manufacturing.",
      });
    }

    const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;

    if (!addressRegex.test(address)) {
      console.log("Invalid address format");
      return Responses._400({
        status: "error",
        message:
          "Invalid address format. Address can only contain letters, numbers, spaces, and the following special characters: , . ' -",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return Responses._400({
        status: "error",
        message:
          "Invalid email format! Please provide a correct email format (ex. johndoe@gmail.com)",
      });
    }

    const existingEmployer = await Employer.findOne({ email: email });
    if (existingEmployer) {
      console.log("Email already exists in the database");
      return Responses._400({
        status: "error",
        message: "Email already exists! Try another one.",
      });
    }

    // const membershipPlanExists = await MembershipPlan.findOne({
    //   membershipPlan,
    // });
    // if (!membershipPlanExists) {
    //   console.log("Membership plan does not exists");
    //   return {
    //     statusCode: 404,
    //     body: JSON.stringify({
    //       error: "Membership plan does not exists! Please choose another one.",
    //     }),
    //   };
    // }

    const newEmployer = new Employer({
      companyName,
      email,
      industry,
      address,
      subscriptionPlan,
    });

    await newEmployer.save();
    console.log("Employer saved to the database", newEmployer);

    return Responses._200({
      status: "success",
      message: "Employer created successfully",
    });
  } catch (error) {
    console.log("An error happened", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while retreiving the employer, check the logs for more information",
    });
  }
};
