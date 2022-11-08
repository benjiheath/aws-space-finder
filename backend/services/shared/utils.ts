import { APIGatewayProxyEvent } from 'aws-lambda';

export const genId = () => {
  return Math.random().toString(36).slice(2);
};

export const parseEventBody = (event: APIGatewayProxyEvent) => {
  return typeof event.body === 'object' ? event.body : JSON.parse(event.body);
};

export const generateItemWithId = (event: APIGatewayProxyEvent) => {
  const itemBody = parseEventBody(event);
  const item = { ...itemBody, id: genId() };

  return item;
};
