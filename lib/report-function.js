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

        const getAllReports = createNodejsFunction(this, "getAllReports", "../resources/handlers/reportHandlers/getAllReports.js", "getAllReports");
        
        const deleteReport = createNodejsFunction(this, "deleteReport", "../resources/handlers/reportHandlers/deleteReport.js", "deleteReport");

        const reports = new apigateway.Resource(this, "ReportResource", {
            parent: props.api.root,
            pathPart: "report-something"
        });

        const getAllReportsResource = new apigateway.Resource(this, "GetAllReportsResource",{
            parent: props.api.root,
            pathPart: "all-reports",
        });

        const deleteReportResource = new apigateway.Resource(this, "DeleteReportFunction", {
            parent: props.api.root,
            pathPart: "delete-report",
        });

        const deleteReportResourceId = new apigateway.Resource(this, "DeleteReportResourceId", {
            parent: deleteReportResource,
            pathPart: "{id}",
        });

        reports.addMethod("POST", new apigateway.LambdaIntegration(createReport));
        
        getAllReportsResource.addMethod("GET", new apigateway.LambdaIntegration(getAllReports) );

        deleteReportResourceId.addMethod("DELETE", new apigateway.LambdaIntegration(deleteReport));
    }
}

module.exports = {ReportFunction};