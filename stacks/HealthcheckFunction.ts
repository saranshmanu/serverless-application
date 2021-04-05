import { Role } from '@aws-cdk/aws-iam'
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';
import { LambdaIntegration, IResource, CfnAuthorizer, AuthorizationType } from '@aws-cdk/aws-apigateway';
import { LogGroup, SubscriptionFilter, FilterPattern } from '@aws-cdk/aws-logs';
import { Function, LayerVersion, Runtime, Code, IFunction } from '@aws-cdk/aws-lambda';

interface MultistackProps extends StackProps {
	gateway: IResource;
	lambdaLayer: LayerVersion;
	managedPolicy: Role;
	authorizer: CfnAuthorizer;
}

class HealthcheckFunction extends Stack {

	constructor(scope: Construct, id: string, props: MultistackProps) {
		super(scope, id, props);

		const lambda = new Function(this, 'healthcheck-function', {
			functionName: 'healthcheck-function',
			handler: 'index.handler',
			code: Code.fromAsset('./src/healthcheck/get/'),
			runtime: Runtime.NODEJS_12_X,
			role: props.managedPolicy,
			layers: [props.lambdaLayer],
			environment: {
				NODE_ENV: process.env.NODE_ENV || '',
				// SSM_PARAMETER: StringParameter.valueFromLookup(this, 'my-plain-parameter-name')
			}
		});

		const lambdaIntegration = new LambdaIntegration(lambda)
		props.gateway.addResource('healthcheck').addMethod('GET', lambdaIntegration, {
			authorizationType: AuthorizationType.CUSTOM,
			authorizer: { authorizerId: props.authorizer.ref }
		});

		const logGroup = new LogGroup(this, 'healthcheck-log-group', { retention: Infinity });
		const filterPattern = FilterPattern.allEvents();
		const configuration = {
			physicalName: 'elastic-search-subscription',
			destination: new LambdaDestination(lambda),
			filterPattern: filterPattern,
			logGroup: logGroup,
		}
		new SubscriptionFilter(this, 'elastic-search-subscription', configuration);
	}
}

export { HealthcheckFunction }
