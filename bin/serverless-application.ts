#!/usr/bin/env node
import { parse } from 'yaml';
import { readFileSync } from 'fs';
import * as cdk from '@aws-cdk/core';
import 'source-map-support/register';
import { ServerlessApplication } from '../lib';

const app = new cdk.App();
const stage = app.node.tryGetContext('stage') as string;
const environment = app.node.tryGetContext('environment') as string;
const file = readFileSync(`./aws/${environment}.yaml`, 'utf8');
const parameters = parse(file);

/* Environment variables for stack deployment */
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1'
};

new ServerlessApplication(app, `${environment}-${stage}-serverless-application`, {
  environment,
  parameters,
  stage,
  env,
});
