#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import { Gateway } from '../stacks/Gateway';
import { LambdaLayer } from '../stacks/LambdaLayer';
import { SSMManagedPolicy } from '../stacks/ManagedPolicy';
import { HealthcheckFunction } from '../stacks/HealthcheckFunction';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') as string;
const environment = app.node.tryGetContext('environment') as string;
const file = readFileSync(`./aws/${environment}.yaml`, 'utf8')
const parameters = parse(file)

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
}

const lambdaLayerStack = new LambdaLayer(app, 'LambdaLayerStack', { env })
const managedPolicyStack = new SSMManagedPolicy(app, 'ManagedPolicyStack', { env })
const gatewayStack = new Gateway(app, 'GatewayStack', {
  lambdaLayer: lambdaLayerStack.lambdaLayer,
  role: managedPolicyStack.role,
  parameters: {
    DEPLOYMENT_STAGE: stage,
    NODE_ENV: parameters.NODE_ENV,
  },
  env,
})

new HealthcheckFunction(app, 'HealthcheckFunctionStack', {
  gateway: gatewayStack.gateway,
  lambdaLayer: lambdaLayerStack.lambdaLayer,
  role: managedPolicyStack.role,
  authorizer: gatewayStack.authorizer,
  parameters: {
    NODE_ENV: parameters.NODE_ENV,
  },
  env,
})

