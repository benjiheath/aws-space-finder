import { TableClient } from './../dbClient';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { config } from '../../config';

const dbClient = new DynamoDB.DocumentClient();

const spacesTable = new TableClient(dbClient, config.db.tables.spaces);

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  let body;

  const response: APIGatewayProxyResult = { statusCode: 200, body: '' };

  try {
    if (event.queryStringParameters) {
      const reqPrimarykey = event.queryStringParameters?.[spacesTable.primaryKey];

      body = reqPrimarykey
        ? await spacesTable.queryByPrimaryKey(reqPrimarykey)
        : await spacesTable.query(event.queryStringParameters);
    } else {
      body = await spacesTable.scan();
    }
  } catch (err) {
    response.body = (err as Error)?.message;
  }

  response.body = JSON.stringify(body);

  return response;
}

export { handler };
