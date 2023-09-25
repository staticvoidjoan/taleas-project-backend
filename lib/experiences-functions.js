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

class ExperienceFunctions extends Construct {
    constructor(scope, id, props) {
      super(scope, id, props);
  
      const createExperience = createNodejsFunction(
        this,
        "createEducation",
        "../resources/handlers/experienceHandlers/createExperience.js",
        "createExperience"
      );

      const updateExperience = createNodejsFunction(
        this,
        "updateExperience",
        "../resources/handlers/experienceHandlers/updateExperience.js",
        "updateExperience"
      );

      const deleteExperience = createNodejsFunction(
        this,
        "deleteExperience",
        "../resources/handlers/experienceHandlers/deleteExperience.js",
        "deleteExperience"
      );

      const experiences = new apigateway.Resource(this, "ExperienceResources", {
        parent: props.api.root,
        pathPart: "experiences",
      })
      const experience = new apigateway.Resource(this, "ExperienceId", {
        parent: experiences,
        pathPart: '{id}'
      })
      experience.addMethod('PUT', new apigateway.LambdaIntegration(updateExperience));
      experience.addMethod('DELETE', new apigateway.LambdaIntegration(deleteExperience));
      experience.addMethod('POST', new apigateway.LambdaIntegration(createExperience));
    }}

    module.exports = {ExperienceFunctions}