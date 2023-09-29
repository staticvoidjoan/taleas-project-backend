const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Post = require("../../models/postModel");
const Responses = require("../apiResponses");

module.exports.getEmployerByEmail = async (event) => {
  console.log("Lambda function invoked");

  await connectDB();
  try {
    const employerEmail = event.pathParameters.email;
    const employer = await Employer.findOne({ email: employerEmail }).select(
      "-__v"
    );

    if (!employer) {
      console.log("Employer not found");
      return Responses._404({
        status: "error",
        message: "Employer is not found",
      });
    }

    const posts = await Post.find({ creatorId: employer._id });

    employer.posts = posts;

    return Responses._200({
      status: "success",
      message: "Employer retreived successfully",
      employer,
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
