import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Table } from '../config';

type QueryResult = PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>;
type ScanResult = PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>;
type PutResult = PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>;

export class TableClient {
  private dbClient: DynamoDB.DocumentClient;

  public tableName: string;
  public primaryKey: string;

  constructor(dbClient: DynamoDB.DocumentClient, table: Table) {
    this.dbClient = dbClient;
    this.tableName = table.tableName;
    this.primaryKey = table.primaryKey;
  }

  public queryByPrimaryKey = (keyValue?: string): Promise<QueryResult> => {
    return this.dbClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: `${this.primaryKey} = :keyValue`,
        ExpressionAttributeValues: { ':keyValue': keyValue },
      })
      .promise();
  };

  public scan = (): Promise<ScanResult> => {
    return this.dbClient.scan({ TableName: this.tableName }).promise();
  };

  public put = (item: Record<string, unknown>): Promise<PutResult> => {
    return this.dbClient
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  };
}
