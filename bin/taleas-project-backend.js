#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { TaleasProjectBackendStack } = require('../lib/taleas-project-backend-stack');
const {CognitoUserPoolUserStack} = require ("../lib/employee-userpool")
const app = new cdk.App();

const cognitoUserPool = new CognitoUserPoolUserStack(app, "CognitoUserPoolUserStack")
new TaleasProjectBackendStack(app, 'TaleasProjectBackendStack', {
    cognitoUserPool: cognitoUserPool 
});


