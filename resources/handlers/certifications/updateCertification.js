const { connectDB } = require("../../config/dbConfig");
const User = require("../../models/userModel");
const Certifications = require("../../models/certeficationsModel");

module.exports.updateCertification = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    await connectDB();
    const id = event.pathParameters.id;
    const certification = await Certifications.findById(id);
    if(!certification){
        console.log('Certification not found');
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({status: "error", error: "Certification not found" }),
        };
      }

    const { title, organization, issueDate, expirationDate, description } = JSON.parse(
      event.body
    );

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

      certification.title = title;
      certification.organization = organization;
      certification.issueDate = issueDate;
      certification.expirationDate = expirationDate;
      certification.description = description;

    const savedCertification = await certification.save();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({ savedCertification }),
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
        message: "An error occurred updating certification",
      }),
    };
  }
};
