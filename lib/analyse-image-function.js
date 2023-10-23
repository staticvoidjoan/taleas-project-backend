const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

function createNodejsFunction(scope, id, entry, handler) {
  const comprehendPermission = new PolicyStatement({
    actions: ["rekognition:*"],
    resources: ["*"], // You can limit the resources as needed
  });

  const s3Perms = new PolicyStatement({
    actions: ["s3:*"],
    resources: ["*"],
  });

  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    entry: path.join(__dirname, entry),
    handler: handler,
    initialPolicy: [comprehendPermission,s3Perms]
  });
}

class AnalyseImageFunction extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    const analyseText = createNodejsFunction(
      this,
      "analyseText",
      "../resources/handlers/contentModeration/analyse-Image.js",
      "handler"
    );

    const analyse = new apigateway.Resource(this, "AnalyseResource", {
      parent: props.api.root,
      pathPart: "analyse-image",
    });

    analyse.addMethod("POST", new apigateway.LambdaIntegration(analyseText));
  }
}

module.exports = { AnalyseImageFunction };
