import { generate } from '/opt/nodejs/utils/authPolicy'

exports.handler = () => {
  const principalId = '94976256-5b6b-4490-83a9-216ffce9608b'
  return generate(
    process.env.CDK_DEFAULT_ACCOUNT || 'us-east-1',
    process.env.CDK_DEFAULT_REGION || '',
    principalId
  );
}