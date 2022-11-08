import { MissingFieldError } from './../shared/validation';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';
import { TableClient } from '../dbClient';
import { validateAsSpaceEntry } from '../shared/validation';
import { genId } from '../shared/utils';

const dbClient = new DynamoDB.DocumentClient();

const spacesTable = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  const itemBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  const item = { ...itemBody, spaceId: genId() };

  try {
    validateAsSpaceEntry(item);

    await spacesTable.put(item);

    result.body = JSON.stringify(`created item with spaceId: ${item.spaceId}`);
  } catch (err) {
    if (err instanceof MissingFieldError) {
      result.statusCode = 403;
    } else {
      result.statusCode = 500;
    }
    result.body = (err as Error)?.message;
  }

  return result;
}

export { handler };
