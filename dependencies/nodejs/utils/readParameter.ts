import * as AWS from 'aws-sdk';
const ssm = new AWS.SSM();

const read = async (parameter: string): Promise<string> => {
  if (parameter.includes('ssm://')) {
    try {
      const value = await ssm.getParameter({
        Name: parameter.slice(5),
        WithDecryption: true
      }).promise()
      return value?.Parameter?.Value ? value.Parameter.Value : ''
    } catch(err) {
      console.log('Failed to read SSM Parameter', err)
    }
  }
  return parameter
}

export { read }