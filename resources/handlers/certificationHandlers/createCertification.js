const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Certifications = require("../../models/experienceModel");

module.exports.createCertification = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const userId = event.pathParameters.id;

    const { title, organization, issueDate, expirationDate, description } =
      JSON.parse(event.body);

    // Regular expressions for validation
    const textRegex = /^[a-zA-Z0-9\s,'-]*$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    // Validate title, issuingOrganization, and issueDate
    if (!title || !organization || issueDate) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error: "Title, issuing organization and issue date are required.",
        }),
      };
    }

    if (
      !textRegex.test(title) ||
      !textRegex.test(organization) ||
      !textRegex.test(description)
    ) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error:
            "Title, issuing organization, and description must be alphanumeric.",
        }),
      };
    }

    // Validate issueDate and expirationDate fields
    if (!issueDate) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ error: "Issue date is required." }),
      };
    }

    if (
      !dateRegex.test(issueDate) ||
      (expirationDate && !dateRegex.test(expirationDate))
    ) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          error: "Issue date and expiration date format is not correct",
        }),
      };
    }

    const certification = new Certifications({
      title,
      organization,
      issueDate,
      expirationDate,
      description,
    });

    const createdCertification = await certification.save();
    const updateUser = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { education: savedEducation._id } }
    );
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        status: "success",
        createdCertification,
        updateUser,
      }),
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
        message: "An error while creating certifications",
      }),
    };
  }
};
