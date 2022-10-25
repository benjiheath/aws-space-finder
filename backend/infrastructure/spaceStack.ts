import { GenericDDBTable } from './genericDDBTable';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as Lambda from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceFinderApi');
  private spacesTable = new GenericDDBTable('Spaces', 'spaceId', this);

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambdaNode = new NodejsFunction(this, 'helloLambdaNode', {
      entry: path.join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });

    this.setupPolicies(helloLambdaNode);
    this.setupLambdaIntegration(helloLambdaNode);
  }

  private setupPolicies(lambdaFn: NodejsFunction) {
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');

    lambdaFn.addToRolePolicy(s3ListPolicy);
  }

  private setupLambdaIntegration(lambdaFn: NodejsFunction) {
    const lambdaIntegration = new LambdaIntegration(lambdaFn);
    const resource = this.api.root.addResource('hello');
    resource.addMethod('GET', lambdaIntegration);
  }
}
