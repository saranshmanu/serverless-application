#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Gateway } from '../stacks/Gateway';
import { LambdaLayer } from '../stacks/LambdaLayer';
import { SSMManagedPolicy } from '../stacks/ManagedPolicy';
import { HealthcheckFunction } from '../stacks/HealthcheckFunction';

const app = new cdk.App();
const stage = app.node.tryGetContext('STAGE') as string;
const parameters = app.node.tryGetContext(stage) as Record<string, string>

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
}

const lambdaLayerStack = new LambdaLayer(app, 'LambdaLayerStack', { env })
const managedPolicyStack = new SSMManagedPolicy(app, 'ManagedPolicyStack', { env })
const gatewayStack = new Gateway(app, 'GatewayStack', {
  lambdaLayer: lambdaLayerStack.lambdaLayer,
  role: managedPolicyStack.role,
  region: env.region,
  env,
})

new HealthcheckFunction(app, 'HealthcheckFunctionStack', {
  gateway: gatewayStack.gateway,
  lambdaLayer: lambdaLayerStack.lambdaLayer,
  role: managedPolicyStack.role,
  authorizer: gatewayStack.authorizer,
  variables: {
    NODE_ENV: parameters.NODE_ENV,
  },
  env,
})

