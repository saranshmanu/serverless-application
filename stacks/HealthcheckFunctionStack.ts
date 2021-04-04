import { LogGroup, SubscriptionFilter, FilterPattern } from '@aws-cdk/aws-logs';
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { Function, LayerVersion, Runtime, Code, IFunction } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';

class HealthcheckFunction extends Stack {

	/**
	 * The function creates a lambda layer for utils
	 * @returns a lambda layer object
	 */
	createLayer = (): LayerVersion => {
		const layer = new LayerVersion(this, 'dependency-layer', {
			code: Code.fromAsset('./dependencies'),
			compatibleRuntimes: [Runtime.NODEJS_12_X],
			license: 'Apache-2.0',
			description: 'A layer that contain the utils for the lambda functions',
		});
		return layer
	}

	/**
	 * The function creates a lambda function
	 * @param params 
	 */
	createFunction = (params: Record<string, unknown>): IFunction => {
		const lambda = new Function(this, params.name as string, {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset(params.path as string),
			handler: params.handler as string,
			layers: [params.layer as LayerVersion],
			environment: params.environment as {
				[key: string]: string;
			}
		});
		return lambda;
	}

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);
		/** 
		 * Lambda Layer for dependencies 
		 */
		const layer = this.createLayer()
		/** 
		 * API Gateway for endpoints 
		 */
		const gateway = new RestApi(this, 'serverless-application-api', {});
		const api = gateway.root.addResource('api');
		/** 
		 * Healthcheck Endpoint 
		 */
		const lambdaFunction = this.createFunction({
			name: 'healthcheck-function',
			handler: 'index.handler',
			path: './src/healthcheck/get/',
			layer: layer,
			environment: {
				NODE_ENV: 'dev'
			}
		})
		const lambdaIntegration = new LambdaIntegration(lambdaFunction)
		api.addResource('healthcheck').addMethod('GET', lambdaIntegration);
		/**
		 * Log Group for the stack 
		 */
		const logGroup = new LogGroup(this, 'HealthcheckLogGroup', { retention: Infinity });
		const filterPattern = FilterPattern.allEvents();
		const configuration = {
			destination: new LambdaDestination(lambdaFunction),
			filterPattern: filterPattern,
			logGroup: logGroup,
		}
		new SubscriptionFilter(this, 'elastic-search-subscription', configuration);
	}
}

export { HealthcheckFunction }
