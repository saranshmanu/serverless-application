import { Role } from '@aws-cdk/aws-iam'
import { Construct } from '@aws-cdk/core';
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';
import { LambdaIntegration, IResource, AuthorizationType, RequestAuthorizer } from '@aws-cdk/aws-apigateway';
import { LogGroup, SubscriptionFilter, FilterPattern } from '@aws-cdk/aws-logs';
import { Function, LayerVersion, Runtime, Code } from '@aws-cdk/aws-lambda';

interface MultistackProps {
  role: Role;
  gateway: IResource;
  lambdaLayer: LayerVersion;
  authorizer: RequestAuthorizer;
  parameters: Record<string, string>;
}

class HealthcheckFunction extends Construct {

  constructor(scope: Construct, id: string, props: MultistackProps) {
    super(scope, id);

    const lambda = new Function(this, 'healthcheck-function', {
      functionName: 'healthcheck-function',
      handler: 'index.handler',
      code: Code.fromAsset('./src/healthcheck/get/'),
      runtime: Runtime.NODEJS_12_X,
      layers: [props.lambdaLayer],
      role: props.role,
      environment: {
        NODE_ENV: props.parameters.NODE_ENV,
        SSM_PARAMETER: props.parameters.SSM_PARAMETER,
      }
    });

    const lambdaIntegration = new LambdaIntegration(lambda)
    props.gateway.addResource('healthcheck').addMethod('GET', lambdaIntegration, {
      authorizationType: AuthorizationType.CUSTOM,
      authorizer: props.authorizer
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
