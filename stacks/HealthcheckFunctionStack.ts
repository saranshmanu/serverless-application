import { LogGroup } from '@aws-cdk/aws-logs';
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';

class HealthcheckFunction extends Stack {

	/**
	 * The function creates a lambda function
	 * @param params 
	 */
	createFunction = (params: Record<string, unknown>): LambdaIntegration => {
		const lambda = new Function(this, params.name as string, {
			runtime: Runtime.NODEJS_12_X,
			code: Code.fromAsset('src'),
			handler: params.handler as string,
			environment: params.environment as {
				[key: string]: string;
			}
		});
		return new LambdaIntegration(lambda);
	}

	constructor(scope: Construct, id: string, props?: StackProps) {
		super(scope, id, props);

		const gateway = new RestApi(this, 'serverless-application-api', {});
		const v1 = gateway.root.addResource('v1');
		new LogGroup(this, 'HealthcheckLogGroup', { retention: Infinity });

		/** Healthcheck Endpoint */
		v1.addResource('healthcheck').addMethod('GET', this.createFunction({
			name: 'healthcheck-function',
			handler: 'healthcheck.get.index.handler',
			environment: {
				NODE_ENV: 'dev'
			}
		}));
	}
}

export { HealthcheckFunction }
