import * as AWS from 'aws-sdk';
const ssm = new AWS.SSM();

const read = async (parameter: string) => {
  if (parameter.includes('ssm://')) {
    const value = await ssm.getParameter({
      Name: parameter.slice(6),
      WithDecryption: true
    }).promise()
    return value
  }
  return parameter
}

export { read }