import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { AWSError, DynamoDB } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { Table } from '../config';

// type QueryResult = PromiseResult<DynamoDB.DocumentClient.QueryOutput, AWSError>;
export type DbQueryResult = DynamoDB.DocumentClient.ItemList | undefined;
export type DbScanResult = PromiseResult<DynamoDB.DocumentClient.ScanOutput, AWSError>;
export type DbPutResult = PromiseResult<DynamoDB.DocumentClient.PutItemOutput, AWSError>;

export class TableClient {
  private dbClient: DynamoDB.DocumentClient;

  public tableName: string;
  public primaryKey: string;
  public secondaryIndexes?: string[];

  constructor(dbClient: DynamoDB.DocumentClient, table: Table) {
    this.dbClient = dbClient;
    this.tableName = table.tableName;
    this.primaryKey = table.primaryKey;
    this.secondaryIndexes = table.secondaryIndexes;
  }

  private queryItems = (key: string, value: any) => {
    return this.dbClient
      .query({
        TableName: this.tableName,
        // IndexName should only be used for secondary indexes - if primary, will throw
        IndexName: key === this.primaryKey ? undefined : key,
        KeyConditionExpression: `${key} = :keyValue`,
        ExpressionAttributeValues: { ':keyValue': value },
      })
      .promise()
      .then((r) => r.Items);
  };

  private parseQuery = (queryParams: APIGatewayProxyEventQueryStringParameters) => {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];
    return { queryKey, queryValue };
  };

  public query = (queryParams: APIGatewayProxyEventQueryStringParameters): Promise<DbQueryResult> => {
    const { queryKey, queryValue } = this.parseQuery(queryParams);

    return this.queryItems(queryKey, queryValue);
  };

  public queryByPrimaryKey = (keyValue?: string): Promise<DbQueryResult> => {
    return this.queryItems(this.primaryKey, keyValue);
  };

  public scan = (): Promise<DbScanResult> => {
    return this.dbClient.scan({ TableName: this.tableName }).promise();
  };

  public put = (item: Record<string, unknown>): Promise<DbPutResult> => {
    return this.dbClient
      .put({
        TableName: this.tableName,
        Item: item,
      })
      .promise();
  };
}
