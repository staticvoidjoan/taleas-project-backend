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

class CertificationFunctions extends Construct {
    constructor(scope, id, props) {
      super(scope, id, props);
  
      const createCertification = createNodejsFunction(
        this,
        "createCertification",
        "../resources/handlers/certificationHandlers/createCertification.js",
        "createCertification"
      );

      const updateCertification = createNodejsFunction(
        this,
        "updateCertification",
        "../resources/handlers/certificationHandlers/updateCertification.js",
        "upedateCertification"
      );

      const deleteCertification = createNodejsFunction(
        this,
        "deleteCertification",
        "../resources/handlers/certificationHandlers/deleteCertification.js",
        "deleteCertification"
      );

      const certifications = new apigateway.Resource(this, "CertificationResources", {
        parent: props.api.root,
        pathPart: "certification",
      })
      const certification = new apigateway.Resource(this, "CertificationId", {
        parent: certifications,
        pathPart: '{id}'
      })
      certification.addMethod('PUT', new apigateway.LambdaIntegration(updateCertification));
      certification.addMethod('DELETE', new apigateway.LambdaIntegration(deleteCertification));
      certification.addMethod('POST', new apigateway.LambdaIntegration(createCertification));
    }}

    module.exports = {CertificationFunctions}