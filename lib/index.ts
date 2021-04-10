import { Stack, Construct, StackProps } from '@aws-cdk/core';

import { Gateway } from './Gateway';
import { LambdaLayer } from './LambdaLayer';
import { SSMManagedPolicy } from './ManagedPolicy';
import { FunctionAuthorizer } from './FunctionAuthorizer';
import { FunctionHealthcheck } from './FunctionHealthcheck';

interface MultistackProps extends StackProps {
  parameters: Record<string, string>;
  environment: string;
  stage: string;
}

class ServerlessApplication extends Stack {

  /**
   * The function converts a ssm parameter according to environment
   * @param parameter  
   */
  read(parameter: string, environment: string) {
    if (parameter.includes('ssm://')) {
      return `${parameter.slice(0, 6)}${environment}/${parameter.slice(6)}`;
    }
    return parameter;
  };

  constructor(scope: Construct, id: string, props: MultistackProps) {
    super(scope, id, props);
    /* Managed Policy Construct for SSM Parameters */
    const { role } = new SSMManagedPolicy(this, 'ManagedPolicy');
    /* Lambda Layer Construct for Lambda Dependencies */
    const { lambdaLayer } = new LambdaLayer(this, 'LambdaLayer');
    /* Gateway Construct for routing Lambda Functions and custom Authorizers */
    const { gateway } = new Gateway(this, 'Gateway', {
      parameters: {
        DEPLOYMENT_STAGE: this.read(props.stage, props.environment),
        NODE_ENV: this.read(props.parameters.NODE_ENV, props.environment)
      },
    });
    /* Custom Authorizer Construct for Lambda Function and Log Groups */
    const { authorizer } = new FunctionAuthorizer(this, 'AuthorizerFunction', {
      lambdaLayer, role,
      parameters: {
        NODE_ENV: this.read(props.parameters.NODE_ENV, props.environment),
        SSM_PARAMETER: this.read(props.parameters.SSM_PARAMETER, props.environment)
      },
    });
    /* Healthcheck Function for Lambda Function and Log Groups */
    new FunctionHealthcheck(this, 'HealthcheckFunction', {
      lambdaLayer, authorizer, gateway, role,
      parameters: {
        NODE_ENV: this.read(props.parameters.NODE_ENV, props.environment),
        SSM_PARAMETER: this.read(props.parameters.SSM_PARAMETER, props.environment)
      },
    });
  }
}

export { ServerlessApplication }