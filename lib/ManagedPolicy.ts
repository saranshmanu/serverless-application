import { Role, ManagedPolicy, ServicePrincipal } from '@aws-cdk/aws-iam'
import { Construct } from '@aws-cdk/core';
import { ManagedPolicies, ServicePrincipals } from "cdk-constants";

class LambdaManagedPolicy extends Construct {

  role: Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.role = new Role(this, 'lambda-managed-policy', {
      roleName: 'lambda-managed-policy',
      assumedBy: new ServicePrincipal(ServicePrincipals.LAMBDA),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(ManagedPolicies.AMAZON_SSM_FULL_ACCESS),
        ManagedPolicy.fromAwsManagedPolicyName(ManagedPolicies.AMAZON_VPC_FULL_ACCESS)
      ]
    });
  }
}

export { LambdaManagedPolicy }
