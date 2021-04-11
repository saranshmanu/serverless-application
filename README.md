# Serverless Application using AWS-CDK

![Serverless Applications](./assets/main.png)

## Introduction
With serverless computing, infrastructure management tasks like capacity provisioning and patching are handled by AWS, so we can focus on only writing code that serves. Serverless services like AWS Lambda comes with automatic scaling and built-in high availability features.

## AWS Services used by the Application
The following services are used to create a serverless RESTApi using various Amazon Web Services.

 - AWS Lambda Functions
 - AWS API Gateway
 - AWS System Manager
 - AWS Subscription Filter
 - AWS Managed Policy
 - AWS Log Groups
 - AWS Cloud Formation Stacks
 - AWS Virtual Private Cloud
 - AWS IAM

## Usage 
### Installation Process

Install AWS CDK

```bash
npm install -g aws-cdk
```

Configure AWS credentials

```bash
aws configure
```

### Build

The application is built to support different stages and environments. The ssm keys are read according to the environment and we will have to configure it according to the format ```/<environment>/serverless-application/<parameter-name>``` in the AWS console

```bash
npm run build
cdk bootstrap
cdk synth --quiet -c stage=<prod/dev/stage> -c environment=<delta/iota>
```

### Deploy

We need to specify the stage and environment to which we have to deploy

```bash
cdk deploy --all -c stage=<prod/dev/stage> -c environment=<delta/iota>
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](https://choosealicense.com/licenses/mit/)