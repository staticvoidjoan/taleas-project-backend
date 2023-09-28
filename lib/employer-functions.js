const { Stack, Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require('@aws-cdk/aws-iam');

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

    const authorizer = props.authorizer
    const createEmployer = createNodejsFunction(this, "createEmployer", "../resources/handlers/employerHandlers/createEmployer.js", "createEmployer");

    const getEmployerById = createNodejsFunction(this, "getEmployerById", "../resources/handlers/employerHandlers/getEmployerById.js", "getEmployerById");

    const deleteEmployer = createNodejsFunction(this, "deleteEmployer", "../resources/handlers/employerHandlers/deleteEmployer.js", "deleteEmployer");

    const updateEmployer = createNodejsFunction(this, "updateEmployer", "../resources/handlers/employerHandlers/updateEmployer.js", "updateEmployer");

    const likeUser = createNodejsFunction(this, "likeUser", "../resources/handlers/employerHandlers/likeUser.js", "likeUser");

    const getEmployerByEmail = createNodejsFunction(this, "getEmployerByEmail", "../resources/handlers/employerHandlers/getEmployerByEmail.js", "getEmployerByEmail");

    //will be used for the web hook in the stripe
    const subscriptionHandler = createNodejsFunction(this, "subscriptionHandler", "../resources/handlers/employerHandlers/subscriptionHandler.js", "subscriptionHandler");
    
    const dislikeUsers = createNodejsFunction(this, "dislikeUser", "../resources/handlers/employerHandlers/dislikeUser.js", "dislikeUser");
    
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

    const employerEmail = new apigateway.Resource(this, "EmployerEmailResource", {
        parent: props.api.root,
        pathPart: "employer-email",
    });

    const employerEmailNew = new apigateway.Resource(this, "EmployerEmailResourceNew", {
        parent: employerEmail,
        pathPart: "{email}",
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

    const dislikeUserQuery = new apigateway.Resource(this, "DislikeUserQuery", {
        parent: props.api.root,
        pathPart: "employer-dislike",
    });

    const dislikeUserQueryId = new apigateway.Resource(this, "DislikeUserQueryId", {
        parent: dislikeUserQuery,
        pathPart: "{id}",
        requestParameters: {
            "method.request.querystring.myQueryParam": true,
        },
    });

    const webHookStripe = new apigateway.Resource(this, "WebHookStripe",{
        parent: props.api.root,
        pathPart: "web-hook",
    });

    webHookStripe.addMethod("POST", new apigateway.LambdaIntegration(subscriptionHandler));

    employer.addMethod("POST", new apigateway.LambdaIntegration(createEmployer),{
        authorizer: authorizer,
    });
    employerId.addMethod("GET", new apigateway.LambdaIntegration(getEmployerById),{
        authorizer: authorizer,
    });
    employerEmailNew.addMethod("GEt", new apigateway.LambdaIntegration(getEmployerByEmail),{
        authorizer: authorizer,
    });
    updateEmployerResourceId.addMethod("PUT", new apigateway.LambdaIntegration(updateEmployer),{
        authorizer: authorizer,
    });
    deleteEmployerResourceId.addMethod("DELETE", new apigateway.LambdaIntegration(deleteEmployer),{
        authorizer: authorizer,
    });
    likeUserQueryId.addMethod("PUT", new apigateway.LambdaIntegration(likeUser),{
        authorizer: authorizer,
    });
    dislikeUserQueryId.addMethod("PUT", new apigateway.LambdaIntegration(dislikeUsers));
  }
}

module.exports = { EmployerFunction };
