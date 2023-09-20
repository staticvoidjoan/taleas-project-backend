const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const {NodejsFunction} = require('aws-cdk-lib/aws-lambda-nodejs')
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");


class TaleasProjectBackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const createUser = new NodejsFunction(this, "createUser", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/userHandlers/createUser.js"),
      handler: "createUser",
    });

    const completeProfile = new NodejsFunction(this, "completeProfile", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/userHandlers/completeProfile.js"),
      handler: "completeProfile",
    });

    const profileComplete = new NodejsFunction(this, "profileComplete", {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      entry: path.join(__dirname, "../resources/handlers/userHandlers/profileCompleted.js"),
      handler: "profileComplete",
    });

    
    const api = new apigateway.RestApi(this, "lambdacdk-api", {
      restApiName: "apricus",
      description: "Deploy using aws cdk",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Authorization"],
      },
    });

    const user = new apigateway.Resource(this, "UserResource", {
      parent: api.root,
      pathPart: "user",
    });
    const completeProfileApi = new apigateway.Resource(this, "CompleteProfileResource", {
      parent: user,
      pathPart: "{email}",
    });
    const updateProfile = new apigateway.Resource(this, "UpdateProfileResource", {
      parent: api.root,
      pathPart: "{email}",
    });
    user.addMethod('POST', new apigateway.LambdaIntegration(createUser));
    completeProfileApi.addMethod('PUT', new apigateway.LambdaIntegration(completeProfile));
    updateProfile.addMethod('PUT', new apigateway.LambdaIntegration(profileComplete));
  }
}

module.exports = { TaleasProjectBackendStack }
