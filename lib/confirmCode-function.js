const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

function createNodejsFunction(scope, id, entry, handler) {
  const cognitoPerms = new PolicyStatement({
    actions: ["cognito:*"],
    resources: ["*"], 
  });

  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: path.join(__dirname, entry),
    handler: handler,
    initialPolicy: [cognitoPerms],
  });
}

class ConfirmCodeFunction  extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    const confirmCode = createNodejsFunction(
      this,
      "analyseText",
      "../resources/handlers/lambdaTriggerHandlers/confirmResetCode.js",
      "handler"
    );

    const confirmCodeApi = new apigateway.Resource(this, "confirmCode", {
      parent: props.api.root,
      pathPart: "confirmCode",
    });

    confirmCodeApi.addMethod("POST", new apigateway.LambdaIntegration(confirmCode));
  }
}

module.exports = { ConfirmCodeFunction  };
