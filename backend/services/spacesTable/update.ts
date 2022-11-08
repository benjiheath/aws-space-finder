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

  const reqBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  const spaceId = event.queryStringParameters?.[primaryKey];

  if (!spaceId) {
    throw new Error('No spaceId provided');
  }

  const updatedResult = await spacesTable.update(spaceId, reqBody);

  result.body = JSON.stringify(updatedResult);

  return result;
}

export { handler };
