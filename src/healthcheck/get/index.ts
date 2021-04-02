import { create } from '/opt/nodejs/utils/response'

exports.handler = async (event: any) => {
	console.log('Received request for healthcheck');
	return create(200, {
		status: 200,
		message: 'Alive',
		environment: process.env.NODE_ENV,
	})
}
