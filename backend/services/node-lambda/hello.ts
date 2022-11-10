import { APIGatewayProxyEvent } from 'aws-lambda';
import { S3 } from 'aws-sdk';

const s3Client = new S3();

async function handler(event: any, context: any) {
  if (isAdmin(event)) {
    return {
      statusCode: 200,
      body: JSON.stringify('You are an admin!'),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify('You are __NOT__ an admin'),
  };
}

const isAdmin = (event: APIGatewayProxyEvent) => {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  return groups.includes('admins');
};

export { handler };
