const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const { UserFunctions} = require('./user-functions');
const { EducationFunctions } = require('./education-functions');
const { ExperienceFunctions } = require('./experiences-functions');
const { CertificationFunctions } = require('./certification-functions');
const { UploadImage } = require('./uploadImage-function');
const { EmployerFunction } = require('./employer-functions');
const { PostFunctions } = require('./posts-functions');
const { CategoryFunctions } = require('./category-functions');
const { ContactFunction } = require('./contact-function');
const {LambdaTriggerFunction} = require('./lambdaTrigger-functions');

class TaleasProjectBackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const api = new apigateway.RestApi(this, "lambdacdk-api", {
      restApiName: "Career Crush",
      description: "Deploy using aws cdk",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Authorization", "Content-Type"],
      },
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
      this,
      "MyAuthorizer",
      {
        cognitoUserPools: [props.cognitoUserPool.userpool],
        identitySource: "method.request.header.Authorization",
      }
    );

    new UserFunctions(this, "UserFunctions", {api, authorizer})
    new EducationFunctions(this, "EducationFunctions", {api, authorizer,})
    new ExperienceFunctions(this, "ExperienceFunctions", {api, authorizer})
    new CertificationFunctions(this, "CertificationFunctions", {api, authorizer});
    new UploadImage(this, "UploadImage")
    new EmployerFunction(this, "EmployerFunction", {api, authorizer})
    new PostFunctions(this, "PostFunctions", {api, authorizer})
    new CategoryFunctions(this, "CategoryFunctions", {api, authorizer})
    new ContactFunction(this, "ContactFunction", {api})
    new LambdaTriggerFunction(this, "LambdaTriggerFunction", {api})
}
}

module.exports = { TaleasProjectBackendStack }
