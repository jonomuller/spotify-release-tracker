import { APIGatewayEvent } from 'aws-lambda';

import controller from './controller';

export async function handler(event: APIGatewayEvent) {
  const request = {
    queryParams: event.queryStringParameters
  };

  return controller(request);
}
