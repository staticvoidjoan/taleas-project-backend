#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { TaleasProjectBackendStack } = require('../lib/taleas-project-backend-stack');
const {CognitoUserPoolUserStack} = require ("../lib/employee-userpool")
const {ContentStack} = require("../lib/content-stack.js");
const app = new cdk.App();
const eu2 = {region: "eu-west-2",}
const cognitoUserPool = new CognitoUserPoolUserStack(app, "CognitoUserPoolUserStack")
new TaleasProjectBackendStack(app, 'TaleasProjectBackendStack', {
    cognitoUserPool: cognitoUserPool 
});
new ContentStack(app,"CareerCrushContentStack",{env: eu2});



