const { Stack, Duration } = require("aws-cdk-lib");
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");

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

    const createEmployerResource = new apigateway.Resource(this, "CreateEmployerResource", {
        parent: props.api.root,
        pathPart: "employer",
    });
  
    const updateProfileResource = new apigateway.Resource(this, "UpdateProfileResource", {
        parent: props.api.root,
        pathPart: "update-profile",
    });

    const updateProfileResourceId = new apigateway.Resource(this, "UpdateProfileResourceId", {
        parent: updateProfileResource,
        path: "{id}"
    })
  
    const employerIdResource = new apigateway.Resource(this, "EmployerIdResource", {
        parent: createEmployerResource,
        pathPart: "{id}",
    });
  
    const deleteProfileResource = new apigateway.Resource(this, "DeleteProfileResource", {
        parent: props.api.root,
        pathPart: "delete-profile",
    });

    const deleteProfileResourceId = new apigateway.Resource(this, "DeleteProfileResourceId", {
        parent: deleteProfileResource,
        path: "{id}"
    })

    const likeUserResource = new apigateway.Resource(this, "LikeUserResource", {
        parent: createEmployerResource,
        pathPart: "like-user",
    });
    
    const likeUserWithIdResource = new apigateway.Resource(this, "LikeUserWithIdResource", {
        parent: likeUserResource,
        path: "{id}",
        requestParameters: {
            "method.request.querystring.myQueryParam": true,
          },
    });

    const createEmployer = createNodejsFunction(
      this,
      "createEmployer",
      "../resources/handlers/employerHandlers/createEmployer.js",
      "createEmployer"
    );

    const getEmployerById = createNodejsFunction(
      this,
      "getEmployerById",
      "../resources/handlers/employerHandlers/getEmployerById.js",
      "getEmployerById"
    );
    const deleteEmployer = createNodejsFunction(
      this,
      "deleteEmployer",
      "../resources/handlers/employerHandlers/deleteEmployer.js",
      "deleteEmployer"
    );
    const likeUser = createNodejsFunction(
      this,
      "likeUser",
      "../resources/handlers/employerHandlers/likeUser.js",
      "likeUser"
    );
    const updateEmployer = createNodejsFunction(
      this,
      "updateEmployer",
      "../resources/handlers/employerHandlers/updateEmployer.js",
      "updateEmployer"
    );

    createEmployerResource.addMethod("POST", new apigateway.LambdaIntegration(createEmployer));
    employerIdResource.addMethod("GET", new apigateway.LambdaIntegration(getEmployerById));
    deleteProfileResourceId.addMethod("DELETE", new apigateway.LambdaIntegration(deleteEmployer));
    updateProfileResourceId.addMethod("PUT", new apigateway.LambdaIntegration(updateEmployer));
    likeUserWithIdResource.addMethod("POST", new apigateway.LambdaIntegration(likeUser));
  }
}

module.exports = { EmployerFunction };
