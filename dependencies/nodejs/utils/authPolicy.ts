import { Logger } from "tslog";
const log: Logger = new Logger();

const generate = async (region: string, account: string, uuid: string, arn: string) => {
  console.log("Generated Auth Policy");
  const policy = {
    "principalId": uuid,
    "policyDocument": {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "execute-api:Invoke",
          "Effect": "Allow",
          "Resource": [
            "*"
          ]
        }
      ]
    }
  }
  return policy
}

export { generate }