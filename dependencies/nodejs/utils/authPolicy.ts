import { AuthPolicy } from "aws-api-auth-policy";

const generate = (region: string, account: string, uuid: string) => {
  var authPolicy = new AuthPolicy(uuid, account, {
    region: region,
  });
  authPolicy.allowAllMethods();
  return authPolicy.build();
}

export { generate }