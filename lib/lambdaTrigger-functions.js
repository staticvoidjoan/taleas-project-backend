const { Stack, Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require("@aws-cdk/aws-iam");

function createNodejsFunction(stack, id, handlerPath) {
  return new NodejsFunction(stack, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: path.join(__dirname, handlerPath),
    handler: id,
  });
}

class LambdaTriggerFunction extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const lambdaTrigger = createNodejsFunction(
      this,
      "lambdaTrigger",
      "../resources/handlers/lambdaTriggerHandlers/lambdaTrigger.js",
      "lambdaTrigger"
    );

    const lambdaT = new apigateway.Resource(this, "LambdaTriggerResource", {
      parent: props.api.root,
      pathPart: "profile-create",
    });

    lambdaT.addMethod("POST", new apigateway.LambdaIntegration(lambdaTrigger));
  }
}

module.exports = { LambdaTriggerFunction };

