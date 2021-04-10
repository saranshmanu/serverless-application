import { Stack, StackProps, Construct } from '@aws-cdk/core';
import { LayerVersion, Runtime, Code } from '@aws-cdk/aws-lambda';

class LambdaLayer extends Construct {

  lambdaLayer: LayerVersion;

  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.lambdaLayer = new LayerVersion(this, 'dependency-layer', {
      layerVersionName: 'serverless-lambda-layer',
      code: Code.fromAsset('./dependencies'),
      compatibleRuntimes: [Runtime.NODEJS_12_X],
      license: 'Apache-2.0',
      description: 'A layer that contain the utils for the lambda functions',
    });
  }
}

export { LambdaLayer }
