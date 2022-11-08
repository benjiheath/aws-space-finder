import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/spacesTable/create';

// const event: APIGatewayProxyEvent = {
//   queryStringParameters: {
//     spaceId: 'a742cb03-1c34-4bba-b10c-84fe96d888c8',
//   },
// } as any;

// const event: APIGatewayProxyEvent = {
//   queryStringParameters: {
//     spaceId: 'f15aa393-5c12-4929-ad3e-f8670eda5660',
//   },
// } as any;

const event: APIGatewayProxyEvent = {
  body: {
    name: 'bla',
    whereabouts: 'bla',
  },
} as any;

const result = handler(event, {} as any).then((res) => {
  const items = JSON.parse(res.body);
  console.log(123);
});
