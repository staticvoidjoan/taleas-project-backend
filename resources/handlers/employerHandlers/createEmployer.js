const AWS = require("aws-sdk");
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const {connectDB} = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");

module.exports.createEmployer = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();
  console.log("Connected to the database");

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { companyName, industry, address,  subscriptionPlan } = data;

    if (!companyName || !industry || !subscriptionPlan) {
      console.log("All fields are required");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "All fields are required( company name, industry, address and subscription plan)",
        }),
      };
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(companyName)) {
      console.log("Invalid name format");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            "Invalid name format! The company name should only contain letters and spaces",
        }),
      };
    }

    const industryName = /^[A-Za-z\s]+$/;
    if (!industryName.test(industry)) {
      console.log("Invalid industry title");
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Industry should only contain letters and symbols",
        }),
      };
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
      industry,
      address,
      subscriptionPlan,
    });

    await newEmployer.save();
    console.log("Employer saved to the database", newEmployer);

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS, POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ message: "Company data saved successfully" }),
    };
  } catch (error) {
    console.log("An error happened", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "An error occurred while creating the employer",
      }),
    };
  }
};
