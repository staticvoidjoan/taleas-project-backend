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

class CategoryFunctions extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const authorizer = props.authorizer;
    const getCategories = createNodejsFunction(
      this,
      "getCategories",
      "../resources/handlers/categoryHandlers/getCategories.js",
      "getCategories"
    );

    const category = new apigateway.Resource(this, "CategoryResource", {
      parent: props.api.root,
      pathPart: "category",
    });
    category.addMethod("GET", new apigateway.LambdaIntegration(getCategories), {
      authorizer: authorizer,
    });
  }
}
module.exports = { CategoryFunctions };
