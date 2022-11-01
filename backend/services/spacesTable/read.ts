import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getEnv } from '../../utils/getEnv';

const TABLE_NAME = getEnv('TABLE_NAME');

const dbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  try {
    const res = await dbClient.scan({ TableName: TABLE_NAME }).promise();
    result.body = JSON.stringify(res);
  } catch (err) {
    result.body = (err as Error)?.message;
  }

  return result;
}

export { handler };
