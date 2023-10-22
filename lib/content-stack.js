const { Stack, Duration } = require("aws-cdk-lib");
// const sqs = require('aws-cdk-lib/aws-sqs');
const { Construct } = require("constructs");
const apigateway = require("aws-cdk-lib/aws-apigateway");
//AWS COMPREHEND FUNCTION
const { AnalyseFunction } = require("./analyse-function");
const {AnalyseImageFunction} = require("./analyse-image-function");
class ContentStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    this.env = {
        region: 'eu-west-2',
      };

    const api = new apigateway.RestApi(this, "careercrush-content-api", {
      restApiName: "Career Crush",
      description: "Deploy using aws cdk",
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Authorization", "Content-Type"],
      },
    });

    new AnalyseFunction(this, "AnalyseTextFunction", { api });
    new AnalyseImageFunction(this,"AnalyseImageFunction", { api });
    
  }
}

module.exports = { ContentStack };
