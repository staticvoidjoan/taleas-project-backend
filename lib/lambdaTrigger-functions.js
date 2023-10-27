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

function createNodejsFunction2(scope, id, entry, handler) {
  const cognitoPerms = new PolicyStatement({
    actions: ["cognito:*"],
    resources: ["*"],
  });

  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    entry: path.join(__dirname, entry),
    handler: handler,
    initialPolicy: [cognitoPerms],
  });
}

class LambdaTriggerFunction extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const verifyCode = createNodejsFunction2(
      this,
      "ConfirmCode",
      "../resources/handlers/lambdaTriggerHandlers/confirmResetCode.js",
      "ConfirmCode"
    );

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

    const verifyCodeApi = new apigateway.Resource(this, "VeiryCodeResource", {
      parent: props.api.root,
      pathPart: "verify-reset-code",
    });

    verifyCodeApi.addMethod(
      "POST",
      new apigateway.LambdaIntegration(verifyCode)
    );
  }
}

module.exports = { LambdaTriggerFunction };
