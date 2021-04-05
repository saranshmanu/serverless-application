import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { IResource, RestApi } from '@aws-cdk/aws-apigateway';

class Gateway extends Stack {

  gateway: IResource;

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);
		const gateway = new RestApi(this, 'serverless-application-api', {});
		this.gateway = gateway.root.addResource('api');
	}
}

export { Gateway }
