import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';
import { TableClient } from '../dbClient';
import { parseEventBody } from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const { primaryKey, ...spacesTable } = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const reqBody = parseEventBody(event);
  const spaceId = event.queryStringParameters?.[primaryKey];

  if (!spaceId) {
    throw new Error('No spaceId provided');
  }

  const updatedResult = await spacesTable.update(spaceId, reqBody);

  return {
    statusCode: 200,
    body: JSON.stringify(updatedResult),
  };
}

export { handler };
