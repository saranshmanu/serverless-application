#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HealthcheckFunction } from '../stacks/HealthcheckFunctionStack';

const app = new cdk.App();
new HealthcheckFunction(app, 'HealthcheckFunctionStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
})
