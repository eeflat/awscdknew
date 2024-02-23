#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import {MyInfrastructureStack} from '../lib/my_cdk_app-stack';

const app = new cdk.App();
new MyInfrastructureStack(app, 'MyInfrastructureStack', {
  stackName: 'MyInfrastructureStack',
  env: {
    region: "us-east-1",
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});