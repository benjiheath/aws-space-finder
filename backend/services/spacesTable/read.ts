import { TableClient } from './../dbClient';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';

const dbClient = new DynamoDB.DocumentClient();

const spacesTable = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  try {
    if (event.queryStringParameters) {
      if (spacesTable.primaryKey in event.queryStringParameters) {
        const keyValue = event.queryStringParameters[spacesTable.primaryKey];

        const res = await spacesTable.queryByPrimaryKey(keyValue);

        result.body = JSON.stringify(res);
      } else {
        const res = await spacesTable.query(event.queryStringParameters);

        result.body = JSON.stringify(res);
      }
    } else {
      const res = await spacesTable.scan();
      result.body = JSON.stringify(res);
    }
  } catch (err) {
    result.body = (err as Error)?.message;
  }

  return result;
}

export { handler };
