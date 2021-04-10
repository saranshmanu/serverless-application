import { Construct } from '@aws-cdk/core';
import { IResource, RestApi, Deployment, Stage } from '@aws-cdk/aws-apigateway';

interface MultistackProps {
  parameters: Record<string, string>;
}

class Gateway extends Construct {

  gateway: IResource;

  constructor(scope: Construct, id: string, props: MultistackProps) {
    super(scope, id);
    const gateway = new RestApi(this, 'serverless-application-api', { deploy: false });
    const deployment = new Deployment(this, 'serverless-application-deployment', { api: gateway, retainDeployments: true });
    new Stage(this, props.parameters.DEPLOYMENT_STAGE, { deployment, stageName: props.parameters.DEPLOYMENT_STAGE });
    this.gateway = gateway.root.addResource('api');
  }
}

export { Gateway }
