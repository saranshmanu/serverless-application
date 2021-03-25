#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { HealthcheckFunction } from '../stacks/HealthcheckFunctionStack';

const app = new cdk.App();
new HealthcheckFunction(app, 'HealthcheckFunctionStack');
