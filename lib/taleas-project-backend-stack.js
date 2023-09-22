const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const { UserFunctions} = require('./user-functions');
const { EducationFunctions } = require('./education-functions');
const { ExperienceFunctions } = require('./experiences-functions');
const { CertificationFunctions } = require('./certification-functions');
const { UploadImage } = require('./uploadImage-function');

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
        allowHeaders: ["Authorization"],
      },
    });

    new UserFunctions(this, "UserFunctions", {api})
    new EducationFunctions(this, "EducationFunctions", {api})
    new ExperienceFunctions(this, "ExperienceFunctions", {api})
    new CertificationFunctions(this, "CertificationFunctions", {api});
    new UploadImage(this, "UploadImage")
    // new EmployerFunction(this, "EmployerFunction", {api})
}
}

module.exports = { TaleasProjectBackendStack }
