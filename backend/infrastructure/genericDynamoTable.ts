import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Stack } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';
import path = require('path');
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';

interface CrudCollection<A = unknown> {
  create?: A;
  read?: A;
  update?: A;
  delete?: A;
}

export interface TableProps {
  tableName: string;
  primaryKey: string;
  secondaryIndexes?: string[];
  lambdaPaths?: CrudCollection<string>;
}

export class GenericDynamoTable {
  private stack: Stack;
  private table: dynamo.Table;
  private props: TableProps;

  private lambdas: CrudCollection<NodejsFunction> = {};

  public lambdaIntegrations: CrudCollection<LambdaIntegration> = {};

  public constructor(stack: Stack, props: TableProps) {
    this.stack = stack;
    this.props = props;
    this.init();
  }

  private init() {
    this.createTable();
    this.addSecondaryIndexes();
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

  private addSecondaryIndexes() {
    const { secondaryIndexes } = this.props;

    if (secondaryIndexes) {
      secondaryIndexes.forEach((secondaryIndex) => {
        this.table.addGlobalSecondaryIndex({
          indexName: secondaryIndex,
          partitionKey: {
            name: secondaryIndex,
            type: dynamo.AttributeType.STRING,
          },
        });
      });
    }
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
    const crudActions = ['create', 'read', 'update', 'delete'] as (keyof CrudCollection)[];

    crudActions.forEach((action) => {
      const lambdaPath = this.props?.lambdaPaths?.[action];

      if (lambdaPath) {
        const lambda = this.createSingleLambda(lambdaPath);
        this.lambdas[action] = lambda;
        this.lambdaIntegrations[action] = new LambdaIntegration(lambda);

        this.grantTableRights(this.lambdas[action]);
      }
    });
  }

  private grantTableRights = (lambda?: NodejsFunction) => {
    if (lambda) {
      const permission = lambda === this.lambdas.read ? 'Read' : 'Write';
      this.table[`grant${permission}Data`](lambda);
    }
  };
}
