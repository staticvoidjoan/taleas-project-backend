const { Stack, Duration } = require("aws-cdk-lib");
// const sqs = require('aws-cdk-lib/aws-sqs');
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");

function createNodejsFunction(scope, id, entry, handler) {
  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: path.join(__dirname, entry),
    handler: handler,
  });
}

class EducationFunctions extends Construct {
    constructor(scope, id, props) {
      super(scope, id, props);
  
      const createEducation = createNodejsFunction(
        this,
        "createEducation",
        "../resources/handlers/educationHandlers/createEducation.js",
        "createEducation"
      );

      const updateEducation = createNodejsFunction(
        this,
        "updateEducation",
        "../resources/handlers/educationHandlers/updateEducation.js",
        "upedateEducation"
      );

      const deleteEducation = createNodejsFunction(
        this,
        "deleteEducation",
        "../resources/handlers/educationHandlers/deleteEducation.js",
        "deleteEducation"
      );

      const educations = new apigateway.Resource(this, "EducationResources", {
        parent: props.api.root,
        pathPart: "education",
      })
      const education = new apigateway.Resource(this, "EducationId", {
        parent: educations,
        pathPart: '{id}'
      })
      education.addMethod('PUT', new apigateway.LambdaIntegration(updateEducation));
      education.addMethod('DELETE', new apigateway.LambdaIntegration(deleteEducation));
      education.addMethod('POST', new apigateway.LambdaIntegration(createEducation));
    }}

    module.exports = {EducationFunctions}