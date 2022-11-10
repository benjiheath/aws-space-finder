import { GenericDynamoTable } from './genericDynamoTable';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RestApi, LambdaIntegration, AuthorizationType } from 'aws-cdk-lib/aws-apigateway';
import { AuthorizerWrapper } from './auth/authorizerWrapper';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { config } from '../config';
import path = require('path');

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceFinderApi');
  private authorizer: AuthorizerWrapper;

  private spacesTable = new GenericDynamoTable(this, {
    tableName: 'SpacesTable',
    primaryKey: 'spaceId',
    secondaryIndexes: config.db.tables.spaces.secondaryIndexes,
    lambdaPaths: {
      create: 'create',
      read: 'read',
      update: 'update',
      delete: 'delete',
    },
  });

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.authorizer = new AuthorizerWrapper(this, this.api);

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
    resource.addMethod('GET', lambdaIntegration, {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: this.authorizer.authorizer.authorizerId,
      },
    });
  }

  private setupApiIntegrations() {
    const spacesResource = this.api.root.addResource('spaces');
    spacesResource.addMethod('POST', this.spacesTable.lambdaIntegrations.create);
    spacesResource.addMethod('GET', this.spacesTable.lambdaIntegrations.read);
    spacesResource.addMethod('PUT', this.spacesTable.lambdaIntegrations.update);
    spacesResource.addMethod('DELETE', this.spacesTable.lambdaIntegrations.delete);
  }
}
