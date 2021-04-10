import { create } from '/opt/nodejs/utils/response'
import { read } from '/opt/nodejs/utils/readParameter';

const handler = async (event: any) => {
  console.log('Received request for healthcheck');
  const parameter = await read(process.env.SSM_PARAMETER as string)
  console.log(`Reading SSM Parameter ${parameter}`)
  return create(200, {
    status: 200,
    message: 'Alive',
    environment: process.env.NODE_ENV,
  })
}

export { handler }
