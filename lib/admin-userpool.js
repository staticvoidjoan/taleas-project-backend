const {Stack, RemovalPolicy} = require ("aws-cdk-lib")
const cognito = require('aws-cdk-lib/aws-cognito');
const {UserPool, VerificationEmailStyle, AccountRecovery} = require ("aws-cdk-lib/aws-cognito")

class CognitoUserPoolAdminStack extends Stack {
    constructor(scope,id,props) {
        super(scope,id,props);
        
        const userpool = new UserPool(this, "admin-userpool",{
            userPoolName: "admin-userpool",

            signInAliases: {
                email: true,
            },
            selfSignUpEnabled: true,
            userVerification:{
                emailSubject: "You need to verify your email",
                emailBody: 'Thanks for signing up to \"WEBNAME\"  , Your verification code is {####}. Thank You!. If you have any questions email us at johndoe@mail.com',
                emailStyle: VerificationEmailStyle.CODE
            },
            standartAttributes: {
                givenName: {
                    mutable: false,
                    required: true,
                }, 
                familyName: {
                    mutable: false,
                    required: true,
                }
            },
            passwordPolicy:{
                minLength: 8,
                requireLowercase: true,
                requireUppercase: true,
                requireDigits: true,
                requireSymbols: true
            },
            accountRecoveryPolicy: AccountRecovery.EMAIL_ONLY,
            RemovalPolicy: RemovalPolicy.DESTROY,
        });

        const appClient = userpool.addClient("admin-appclient",{
            userPoolClientName: 'admin-appclient',

            authFlows: {
                userPassword: true,
                userSrp: true
            }
        });

        this.userpool = userpool
        console.log("User Pool ARN:", userpool.userPoolArn);


    }
}

module.exports = {CognitoUserPoolAdminStack};