exports.handler = async (event: any) => {
	console.log('Received request for healthcheck');
	return {
		statusCode: 200,
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			status: 200,
			message: 'Alive',
			environment: process.env.NODE_ENV,
		})
	}
}
