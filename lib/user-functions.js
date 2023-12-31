const { Stack, Duration } = require("aws-cdk-lib");
// const sqs = require('aws-cdk-lib/aws-sqs');
const { NodejsFunction } = require("aws-cdk-lib/aws-lambda-nodejs");
const cdk = require("aws-cdk-lib");
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const path = require("path");
const { PolicyStatement } = require("@aws-cdk/aws-iam");

function createNodejsFunction(scope, id, entry, handler) {
  return new NodejsFunction(scope, id, {
    runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
    entry: path.join(__dirname, entry),
    handler: handler,
  });
}

class UserFunctions extends Construct {
  constructor(scope, id, props) {
    super(scope, id, props);

    const authorizer = props.authorizer
    // const createUser = createNodejsFunction(
    //   this,
    //   "createUser",
    //   "../resources/handlers/userHandlers/createUser.js",
    //   "createUser"
    // );
    const getUserById = createNodejsFunction(
      this,
      "getUser",
      "../resources/handlers/userHandlers/getUserById.js",
      "getUser"
    );
    const getUserByEmail = createNodejsFunction(
      this,
      "getUserByEmail",
      "../resources/handlers/userHandlers/getUserByEmail.js",
      "getUserByEmail"
    );
    const profileComplete = createNodejsFunction(
      this,
      "profileComplete",
      "../resources/handlers/userHandlers/profileCompleted.js",
      "profileComplete"
    );

    const dislikePost = createNodejsFunction(
      this,
      "dislikePost",
      "../resources/handlers/userHandlers/dislikePost.js",
      "dislikePost"
    );

    const likePost = createNodejsFunction(
      this,
      "likePost",
      "../resources/handlers/userHandlers/likePost.js",
      "likePost"
    );

    const updateUserProfile = createNodejsFunction(
      this,
      "updateUserProfile",
      "../resources/handlers/userHandlers/updateUser.js",
      "updateUser"
    );

    const users = new apigateway.Resource(this, "UserResource", {
      parent: props.api.root,
      pathPart: "user",
    });

    const policyStatement = new PolicyStatement({
      actions: ["lambda:InvokeFunction"],
      resources: [
        "arn:aws:lambda:eu-west-3:944511268761:function:TaleasProjectBackendStack-UploadImageuploadImage1A-cxRbW8qlYfWs",
      ], // replace with the ARN of the function
    });

    updateUserProfile.role.addManagedPolicy(policyStatement);
    profileComplete.role.addManagedPolicy(policyStatement);

    const user = new apigateway.Resource(this, "UserById", {
      parent: users,
      pathPart: "{id}",
    });
    const completeProfile = new apigateway.Resource(
      this,
      "UserCompleteProfile",
      { parent: props.api.root, pathPart: "{id}" }
    );
    const userByEmail = new apigateway.Resource(this, "GetUserByEmail", {
      parent: props.api.root,
      pathPart: "userByEmail",
    });
    const userEmail = new apigateway.Resource(this, "GetUSER", {parent: userByEmail, pathPart: "{email}"})
    // users.addMethod("POST", new apigateway.LambdaIntegration(createUser));
    user.addMethod("PUT", new apigateway.LambdaIntegration(updateUserProfile),{
      authorizer: authorizer,
    });
    user.addMethod("GET", new apigateway.LambdaIntegration(getUserById),{
      authorizer: authorizer,
    });
    userEmail.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getUserByEmail),{
        authorizer: authorizer,
      }
    );
    completeProfile.addMethod(
      "PUT",
      new apigateway.LambdaIntegration(profileComplete),{
        authorizer: authorizer,
      }
    );

    const dislikes = new apigateway.Resource(this, "DislikeResource", {
      parent: props.api.root,
      pathPart: "dislike",
      requestParameters: {
        "method.request.querystring.myQueryParam": true,
      },
    });
    const dislike = new apigateway.Resource(this, "DislikeResourceId", {
      parent: dislikes,
      pathPart: "{id}",
      requestParameters: {
        "method.request.querystring.myQueryParam": true,
      },
    });
    const likes = new apigateway.Resource(this, "LikeResource", {
      parent: props.api.root,
      pathPart: "like",
      requestParameters: {
        "method.request.querystring.myQueryParam": true,
      },
    });
    const like = new apigateway.Resource(this, "LikeResourceId", {
      parent: likes,
      pathPart: "{id}",
      requestParameters: {
        "method.request.querystring.myQueryParam": true,
      },
    });
    dislike.addMethod("PUT", new apigateway.LambdaIntegration(dislikePost),{
      authorizer: authorizer,
    });
    like.addMethod("PUT", new apigateway.LambdaIntegration(likePost),{
      authorizer: authorizer,
    });
  }
}

module.exports = { UserFunctions };
