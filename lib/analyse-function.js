const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

function createNodejsFunction(scope, id, entry, handler) {
  const comprehendPermission = new PolicyStatement({
    actions: ["comprehend:*"],
    resources: ["*"], 
  });

  const translatePolicyStatement = new PolicyStatement({
    actions: [
      'translate:TranslateText',
    
    ],
    resources: ['*'], 
  });
  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_14_X,
    entry: path.join(__dirname, entry),
    handler: handler,
    initialPolicy: [comprehendPermission,translatePolicyStatement],
  });
}

class AnalyseFunction extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);
    const analyseText = createNodejsFunction(
      this,
      "analyseText",
      "../resources/handlers/contentModeration/analyse.js",
      "handler"
    );

    const analyse = new apigateway.Resource(this, "AnalyseResource", {
      parent: props.api.root,
      pathPart: "analyse",
    });

    analyse.addMethod("POST", new apigateway.LambdaIntegration(analyseText));
  }
}

module.exports = { AnalyseFunction };
