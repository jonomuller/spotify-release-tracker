import { APIGatewayEvent } from 'aws-lambda';

import makeController from './controller';

export async function handler(event: APIGatewayEvent) {
  const controller = makeController();
  const request = {
    queryParams: event.queryStringParameters
  };

  return controller(request);
}
