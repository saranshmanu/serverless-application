import { Role, ManagedPolicy, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { ManagedPolicies, ServicePrincipals } from "cdk-constants";

class SSMManagedPolicy extends Stack {

  role: Role;

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);
    this.role = new Role(this, 'ssm-managed-policy', {
      roleName: 'serverless-ssm-managed-policy',
      assumedBy: new ServicePrincipal(ServicePrincipals.LAMBDA),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(ManagedPolicies.AMAZON_SSM_FULL_ACCESS)
      ]
    });
  }
}

export { SSMManagedPolicy }
