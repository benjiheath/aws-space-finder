import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import path = require('path');

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceFinderApi');

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambda = new Lambda.Function(this, 'hello Lambda', {
      runtime: Lambda.Runtime.NODEJS_14_X,
      code: Lambda.Code.fromAsset(path.join(__dirname, '..', 'services', 'hello')),
      handler: 'hello.main',
    });

    const helloLambdaIntegration = new LambdaIntegration(helloLambda);
    const helloLamdaResource = this.api.root.addResource('hello');
    helloLamdaResource.addMethod('GET', helloLambdaIntegration);
  }
}
