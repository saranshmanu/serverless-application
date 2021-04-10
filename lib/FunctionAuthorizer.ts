import { Role } from '@aws-cdk/aws-iam'
import { LambdaDestination } from '@aws-cdk/aws-logs-destinations';
import { Construct, Duration } from '@aws-cdk/core';
import { Function, LayerVersion, Runtime, Code } from '@aws-cdk/aws-lambda';
import { LogGroup, SubscriptionFilter, FilterPattern } from '@aws-cdk/aws-logs';
import { IdentitySource, RequestAuthorizer } from '@aws-cdk/aws-apigateway';

interface MultistackProps {
  role: Role;
  lambdaLayer: LayerVersion;
  parameters: Record<string, string>;
}

class FunctionAuthorizer extends Construct {

  authorizer: RequestAuthorizer;

  constructor(scope: Construct, id: string, props: MultistackProps) {
    super(scope, id);

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
        NODE_ENV: props.parameters.NODE_ENV || '',
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
      resultsCacheTtl: Duration.minutes(0),
      handler: authorizerFunction,
      identitySources: [IdentitySource.header('Authorization')]
    });
  }
}

export { FunctionAuthorizer }
