import { generate } from '/opt/nodejs/utils/authPolicy'
import { APIGatewayRequestAuthorizerEvent } from 'aws-lambda';

const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const { methodArn: resource } = event;
  const principalId = '94976256-5b6b-4490-83a9-216ffce9608b'
  const policy = await generate(
    process.env.CDK_DEFAULT_ACCOUNT || 'us-east-1',
    process.env.CDK_DEFAULT_REGION || '',
    principalId,
    resource
  );
  console.log(policy)
  return policy
}

export { handler }