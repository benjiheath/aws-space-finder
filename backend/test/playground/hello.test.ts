import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/spacesTable/read';

// const event: APIGatewayProxyEvent = {
//   queryStringParameters: {
//     spaceId: 'a742cb03-1c34-4bba-b10c-84fe96d888c8',
//   },
// } as any;

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    whereuat: 'Dubbo',
  },
} as any;

const result = handler(event, {} as any).then((res) => {
  const items = JSON.parse(res.body);
  console.log(123);
});
