import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Stack } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import path = require('path');
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

export interface TableProps {
  tableName: string;
  primaryKey: string;
  createLambdaPath?: string;
  readLambdaPath?: string;
  updateLambdaPath?: string;
  deleteLambdaPath?: string;
}

export class GenericDynamoTable {
  private stack: Stack;
  private table: dynamo.Table;
  private props: TableProps;

  private createLambda?: NodejsFunction;
  private readLambda?: NodejsFunction;
  private updateLambda?: NodejsFunction;
  private deleteLambda?: NodejsFunction;

  public createLambdaIntegration: LambdaIntegration;
  public readLambdaIntegration: LambdaIntegration;
  public updateLambdaIntegration: LambdaIntegration;
  public deleteLambdaIntegration: LambdaIntegration;

  public constructor(stack: Stack, props: TableProps) {
    this.stack = stack;
    this.props = props;
    this.init();
  }

  private init() {
    this.createTable();
    this.createLambdas();
  }

  private createTable() {
    const { tableName, primaryKey } = this.props;

    this.table = new dynamo.Table(this.stack, tableName, {
      partitionKey: {
        name: primaryKey,
        type: dynamo.AttributeType.STRING,
      },
      tableName,
    });
  }

  private createSingleLambda(lambdaName: string): NodejsFunction {
    const lambdaId = `${this.props.tableName}-${lambdaName}`;
    return new NodejsFunction(this.stack, lambdaId, {
      entry: path.join(__dirname, '..', 'services', this.props.tableName, `${lambdaName}.ts`),
      handler: 'handler',
      functionName: lambdaId,
      environment: {
        TABLE_NAME: this.props.tableName,
        PRIMARY_KEY: this.props.primaryKey,
      },
    });
  }

  private createLambdas() {
    const actions = ['create', 'read', 'update', 'delete'] as const;

    actions.forEach((action) => {
      const lambdaPath = this.props[`${action}LambdaPath`];

      if (lambdaPath) {
        const lambda = this.createSingleLambda(lambdaPath);
        this[`${action}Lambda`] = lambda;
        this[`${action}LambdaIntegration`] = new LambdaIntegration(lambda);

        this.grantTableRights(this[`${action}Lambda`]);
      }
    });
  }

  private grantTableRights = (lambda?: NodejsFunction) => {
    if (lambda) {
      const permission = lambda === this.readLambda ? 'Read' : 'Write';
      this.table[`grant${permission}Data`](lambda);
    }
  };
}
