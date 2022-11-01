import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { getEnv } from '../../utils/getEnv';

const TABLE_NAME = getEnv('TABLE_NAME');

const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  const itemBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);

  const item = { ...itemBody, spaceId: v4() };

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME,
        Item: item,
      })
      .promise();
  } catch (err) {
    result.body = (err as Error)?.message;
  }

  result.body = JSON.stringify(`created item with spaceId: ${item.spaceId}`);

  return result;
}

export { handler };
