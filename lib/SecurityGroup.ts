import { Construct } from '@aws-cdk/core';
import { Vpc, SubnetType, SecurityGroup } from "@aws-cdk/aws-ec2";

class VPCSecurityGroup extends Construct {

  securityGroup: SecurityGroup;
  vpc: Vpc;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.vpc = new Vpc(this, "vpc", {
      cidr: "10.0.0.0/21",
      subnetConfiguration: [
        {
          subnetType: SubnetType.PRIVATE,
          cidrMask: 24,
          name: "PrivateSubnet"
        },
        {
          subnetType: SubnetType.PUBLIC,
          cidrMask: 28,
          name: "PublicSubnet"
        }
      ]
    })
    this.securityGroup = new SecurityGroup(this, "vpc-security-group", {
      securityGroupName: "vpc-security-group",
      vpc: this.vpc,
    });
  }
}

export { VPCSecurityGroup }
