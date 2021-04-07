import { Role } from '@aws-cdk/aws-iam'
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';
import { IResource, RestApi, IdentitySource, RequestAuthorizer } from '@aws-cdk/aws-apigateway';
import { Function, LayerVersion, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LogGroup, SubscriptionFilter, FilterPattern } from '@aws-cdk/aws-logs';

interface MultistackProps extends StackProps {
	role: Role;
	region: String;
	lambdaLayer: LayerVersion;
}

class Gateway extends Stack {

	gateway: IResource;
	authorizer: RequestAuthorizer;

	constructor(scope: Construct, id: string, props: MultistackProps) {
		super(scope, id, props);

		/**
		 * API Gateway
		 */
		const gateway = new RestApi(this, 'serverless-application-api', {});
		this.gateway = gateway.root.addResource('api');

		/**
		 * Custom Gateway Authorizer
		 */
		const authorizerFunction = new Function(this, 'authorizer-function', {
			functionName: 'authorizer-function',
			handler: 'index.handler',
			code: Code.fromAsset('./src/authorizer/'),
			runtime: Runtime.NODEJS_12_X,
			layers: [props.lambdaLayer],
			role: props.role,
			environment: {
				CDK_DEFAULT_REGION: process.env.CDK_DEFAULT_REGION || '',
				CDK_DEFAULT_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT || '',
				NODE_ENV: process.env.NODE_ENV || '',
			}
		});

		const logGroup = new LogGroup(this, 'authorizer-log-group', { retention: Infinity });
		const filterPattern = FilterPattern.allEvents();
		const configuration = {
			physicalName: 'authorizer-elastic-search-subscription',
			destination: new LambdaDestination(authorizerFunction),
			filterPattern: filterPattern,
			logGroup: logGroup,
		}
		new SubscriptionFilter(this, 'authorizer-elastic-search-subscription', configuration);

		this.authorizer = new RequestAuthorizer(this, 'custom-authorizer', {
			handler: authorizerFunction,
  		identitySources: [IdentitySource.header('Authorization')]
		});
	}
}

export { Gateway }
