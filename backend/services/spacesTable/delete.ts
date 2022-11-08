import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';
import { TableClient } from '../dbClient';

const dbClient = new DynamoDB.DocumentClient();

const { primaryKey, ...spacesTable } = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  const spaceId = event.queryStringParameters?.[primaryKey];

  if (!spaceId) {
    throw new Error('No spaceId provided');
  }

  const deleteResult = await spacesTable.delete(spaceId);

  result.body = JSON.stringify(deleteResult);

  return result;
}

export { handler };
