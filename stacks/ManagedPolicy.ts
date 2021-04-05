import { Role, ManagedPolicy, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { ManagedPolicies, ServicePrincipals } from "cdk-constants";

class SSMManagedPolicy extends Stack {

	managedPolicy: Role;

	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props);
		this.managedPolicy = new Role(this, 'ssm-managed-policy', {
      roleName: 'serverless-ssm-managed-policy',
			assumedBy: new ServicePrincipal(ServicePrincipals.SSM),
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName(ManagedPolicies.AMAZON_SSM_READ_ONLY_ACCESS)
			]
		});
	}
}

export { SSMManagedPolicy }
