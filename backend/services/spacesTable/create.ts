import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { config } from '../../config';
import { TableClient } from '../dbClient';

const dbClient = new DynamoDB.DocumentClient();

const spacesTable = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  const itemBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);

  const item = { ...itemBody, spaceId: v4() };

  try {
    await spacesTable.put(item);
  } catch (err) {
    result.body = (err as Error)?.message;
  }

  result.body = JSON.stringify(`created item with spaceId: ${item.spaceId}`);

  return result;
}

export { handler };
