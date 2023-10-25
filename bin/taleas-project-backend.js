#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { TaleasProjectBackendStack } = require('../lib/taleas-project-backend-stack');
const {CognitoUserPoolUserStack} = require ("../lib/employee-userpool")
const {ContentStack} = require("../lib/content-stack.js");
const app = new cdk.App();
const eu2 = {region: "eu-west-2",}
const eu3 = {region: "eu-west-3",}
const cognitoUserPool = new CognitoUserPoolUserStack(app, "CognitoUserPoolUserStack",{env: eu3})
new TaleasProjectBackendStack(app, 'TaleasProjectBackendStack', {
    cognitoUserPool: cognitoUserPool , env: eu3
});
new ContentStack(app,"CareerCrushContentStack",{env: eu2});



