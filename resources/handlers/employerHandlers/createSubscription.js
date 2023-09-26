const mongoose = require("mongoose");
const SubscriptionPlan = require("../../models/subscriptionPlanModel");
const { connectDB } = require("../../config/dbConfig");
const Responses = require("../apiResponses");

module.exports.createSubscriptionPlan = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { name, posts } = data;

    if (!name || !posts) {
      console.log("All fields are required");
      return Responses._400({
        status: "error",
        message: "All fields are required",
      });
    }

    const existingSubscriptionPlan = await SubscriptionPlan.findOne({ name: name });
    if (existingSubscriptionPlan) {
      console.log("Subscription plan already exists in the database");
      return Responses._400({
        status: "error",
        message: "Subscription plan already exists! Try another one.",
      });
    }

    const newSubscriptionPlan = new SubscriptionPlan({
      name,
      posts
    });

    await newSubscriptionPlan.save();
    console.log("Subscription plan saved to the database", newSubscriptionPlan);

    return Responses._200({
      status: "success",
      message: "Subscription plan created successfully",
    });
  } catch (error) {
    console.log("An error happened", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while creating the subscription plan, check the logs for more information",
    });
  }
};
