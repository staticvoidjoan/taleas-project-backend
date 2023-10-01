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

    // const authorizer = new apigateway.CognitoUserPoolsAuthorizer(
    //   this,
    //   "MyAuthorizer",
    //   {
    //     cognitoUserPools: [props.cognitoUserPool.userpool],
    //     identitySource: "method.request.header.Authorization",
    //   }
    // );

    new UserFunctions(this, "UserFunctions", {api})
    new EducationFunctions(this, "EducationFunctions", {api})
    new ExperienceFunctions(this, "ExperienceFunctions", {api})
    new CertificationFunctions(this, "CertificationFunctions", {api});
    new UploadImage(this, "UploadImage")
    new EmployerFunction(this, "EmployerFunction", {api})
    new PostFunctions(this, "PostFunctions", {api})
    new CategoryFunctions(this, "CategoryFunctions", {api})
    new ContactFunction(this, "ContactFunction", {api})
}
}

module.exports = { TaleasProjectBackendStack }
