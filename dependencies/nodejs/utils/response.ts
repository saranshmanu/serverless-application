import { Logger } from "tslog";
const log: Logger = new Logger();

const create = (statusCode: number, response: Record<string, unknown>) => {
  log.silly("Generating response");
  return {
    statusCode: statusCode,
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify(response)
  }
}

export { create }