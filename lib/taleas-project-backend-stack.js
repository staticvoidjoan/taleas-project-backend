const { Stack, Duration } = require('aws-cdk-lib');
// const sqs = require('aws-cdk-lib/aws-sqs');
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
const { UserFunctions} = require('./user-functions');
// const { EmployerFunction } = require('./employer-functions');


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
    // new EmployerFunction(this, "EmployerFunction", {api})
}
}

module.exports = { TaleasProjectBackendStack }
