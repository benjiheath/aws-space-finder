import { MissingFieldError } from './../shared/validation';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';
import { TableClient } from '../dbClient';
import { validateAsSpaceEntry } from '../shared/validation';
import { generateItemWithId } from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const spacesTable = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = { statusCode: 200, body: '' };

  const item = generateItemWithId(event, spacesTable.primaryKey);

  try {
    validateAsSpaceEntry(item);

    await spacesTable.put(item);

    result.body = JSON.stringify(`created item with spaceId: ${item.spaceId}`);
  } catch (err) {
    result.statusCode = err instanceof MissingFieldError ? 403 : 500;
    result.body = (err as Error)?.message;
  }

  return result;
}

export { handler };
