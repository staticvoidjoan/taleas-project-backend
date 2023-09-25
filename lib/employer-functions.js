const { Stack, Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { LambdaInsightsVersion } = require("aws-cdk-lib/aws-lambda");
const { PolicyStatement } = require("aws-cdk-lib/aws-iam");

function createNodejsFunction(stack, id, handlerPath) {
  return new NodejsFunction(stack, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: path.join(__dirname, handlerPath),
    handler: id,
  });
}

class EmployerFunction extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const createEmployer = createNodejsFunction(this, "createEmployer", "../resources/handlers/employerHandlers/createEmployer.js", "createEmployer");

    const getEmployerById = createNodejsFunction(this, "getEmployerById", "../resources/handlers/employerHandlers/getEmployerById.js", "getEmployerById");

    const deleteEmployer = createNodejsFunction(this, "deleteEmployer", "../resources/handlers/employerHandlers/deleteEmployer.js", "deleteEmployer");

    const updateEmployer = createNodejsFunction(this, "updateEmployer", "../resources/handlers/employerHandlers/updateEmployer.js", "updateEmployer");

    const likeUser = createNodejsFunction(this, "likeUser", "../resources/handlers/employerHandlers/likeUser.js", "likeUser");

    const employer = new apigateway.Resource(this, "EmployerResource", {
        parent: props.api.root,
        pathPart: "employer",
    });

    const policyStatement = new PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        resources: ['arn:aws:lambda:eu-west-3:944511268761:function:TaleasProjectBackendStack-UploadImageuploadImage1A-cxRbW8qlYfWs']
    })

    updateEmployer.role.addManagedPolicy(policyStatement);

    const employerId = new apigateway.Resource(this, "EmployerIdResource", {
        parent: employer,
        pathPart: "{id}",
    });

    const updateEmployerResource = new apigateway.Resource(this, "UpdateEmployerResource", {
        parent: props.api.root,
        pathPart: "update-profile",
    });

    const updateEmployerResourceId = new apigateway.Resource(this, "UpdateProfileResourceId", {
        parent: updateEmployerResource,
        pathPart: "{id}",
    });

    const deleteEmployerResource = new apigateway.Resource(this, "DeleteEmployerResource", {
        parent: props.api.root,
        pathPart: "delete-profile",
    });

    const deleteEmployerResourceId = new apigateway.Resource(this, "DeleteEmployerResourceId", {
        parent: deleteEmployerResource,
        pathPart: "{id}",
    });

    const likeUserQuery = new apigateway.Resource(this, "LikeUserQuery", {
        parent: props.api.root,
        pathPart: "like-user"
    });
    
    const likeUserQueryId  = new apigateway.Resource(this, "LikeUserQueryId", {
        parent: likeUserQuery,
        pathPart: "{id}",
        requestParameters: {
            "method.request.querystring.myQueryParam": true,
        },
    });

    employer.addMethod("POST", new apigateway.LambdaIntegration(createEmployer));
    employerId.addMethod("GET", new apigateway.LambdaIntegration(getEmployerById));
    updateEmployerResourceId.addMethod("PUT", new apigateway.LambdaIntegration(updateEmployer));
    deleteEmployerResourceId.addMethod("DELETE", new apigateway.LambdaIntegration(deleteEmployer));
    likeUserQueryId.addMethod("PUT", new apigateway.LambdaIntegration(likeUser));
  }
}

module.exports = { EmployerFunction };
