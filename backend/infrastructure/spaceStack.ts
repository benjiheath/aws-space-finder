import { GenericDynamoTable } from './genericDynamoTable';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import path = require('path');
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceFinderApi');
  private spacesTable = new GenericDynamoTable(this, {
    tableName: 'SpacesTable',
    primaryKey: 'spaceId',
    createLambdaPath: 'create',
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const helloLambdaNode = new NodejsFunction(this, 'helloLambdaNode', {
      entry: path.join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });

    this.setupPolicies(helloLambdaNode);
    this.setupGenericLambdaIntegration(helloLambdaNode);
    this.setupApiIntegrations();
  }

  private setupPolicies(lambdaFn: NodejsFunction) {
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');

    lambdaFn.addToRolePolicy(s3ListPolicy);
  }

  private setupGenericLambdaIntegration(lambdaFn: NodejsFunction) {
    const lambdaIntegration = new LambdaIntegration(lambdaFn);
    const resource = this.api.root.addResource('hello');
    resource.addMethod('GET', lambdaIntegration);
  }

  private setupApiIntegrations() {
    const spacesResource = this.api.root.addResource('spaces');
    spacesResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
  }
}
