import { Stack } from 'aws-cdk-lib';
import * as dynamo from 'aws-cdk-lib/aws-dynamodb';

export class GenericDDBTable {
  private name: string;
  private primaryKey: string;
  private stack: Stack;
  private table: dynamo.Table;

  public constructor(name: string, primarKey: string, stack: Stack) {
    this.name = name;
    this.primaryKey = primarKey;
    this.stack = stack;
    this.init();
  }

  private init() {
    this.createTable();
  }

  private createTable() {
    this.table = new dynamo.Table(this.stack, this.name, {
      partitionKey: {
        name: this.primaryKey,
        type: dynamo.AttributeType.STRING,
      },
      tableName: this.name,
    });
  }
}
