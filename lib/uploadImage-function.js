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

class UploadImage extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const uploadImage = createNodejsFunction(
        this,
        "uploadImage",
        "../resources/handlers/imageHandler/updateImages.js",
        "uploadImages"
      );
  }}

  module.exports = {UploadImage}