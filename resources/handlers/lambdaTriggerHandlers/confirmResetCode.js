const AWS = require("aws-sdk");

exports.handler = async (event) => {
  const { username, code } = JSON.parse(event.body);
  const cognito = new AWS.CognitoIdentityServiceProvider();

  console.log("Username: " + username);
  console.log("Code: " + code);
  if (!username) {
    console.log("No username provided");
    return {
      statusCode: 404,
      body: "No username provided",
    };
  }

  if (!code) {
    console.log("No code provided");
    return {
      statusCode: 404,
      body: "No code provided",
    };
  }

  try {
    await cognito
      .confirmForgotPassword({
        Username: username,
        ConfirmationCode: code,
        ClientId: "eu-west-3_35lqu0IKq",
      })
      .promise();

    return {
      statusCode: 200,
      body: "Code verified successfully",
    };
  } catch (error) {
    console.error("Code verification failed:", error);

    return {
      statusCode: 400,
      body: "Code verification failed",
    };
  }
};
