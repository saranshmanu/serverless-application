#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Gateway } from '../stacks/Gateway';
import { LambdaLayer } from '../stacks/LambdaLayer';
import { SSMManagedPolicy } from '../stacks/ManagedPolicy';
import { HealthcheckFunction } from '../stacks/HealthcheckFunction';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
}

const gatewayStack = new Gateway(app, 'GatewayStack', { env })
const lambdaLayerStack = new LambdaLayer(app, 'LambdaLayerStack', { env })
const managedPolicyStack = new SSMManagedPolicy(app, 'ManagedPolicyStack', { env })

new HealthcheckFunction(app, 'HealthcheckFunctionStack', {
  gateway: gatewayStack.gateway,
  lambdaLayer: lambdaLayerStack.lambdaLayer,
  managedPolicy: managedPolicyStack.managedPolicy,
  env
})

