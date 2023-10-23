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

class ReportFunction extends Construct{
    constructor(scope, id, props){
        super(scope, id, props);

        const createReport = createNodejsFunction(this, "createReport", "../resources/handlers/reportHandlers/reportHandler.js", "createReport");

        const reports = new apigateway.Resource(this, "ReportResource", {
            parent: props.api.root,
            pathPart: "report-something"
        });

        reports.addMethod("POST", new apigateway.LambdaIntegration(createReport));
    }
}

module.exports = {ReportFunction};