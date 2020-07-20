import { DynamoDB } from 'aws-sdk';
import Spotify from 'spotify-web-api-node';

import { User } from '../../models/User';
import { Request } from './types';

export default async function controller(request: Request) {
  const { code, error, state } = request.queryParams;

  if (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ reason: error })
    };
  }

  if (state !== process.env.SPOTIFY_STATE) {
    return {
      statusCode: 400,
      body: JSON.stringify({ reason: 'state mismatch' })
    };
  }

  const spotify = new Spotify({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });

  const { body: creds } = await spotify.authorizationCodeGrant(code);

  spotify.setAccessToken(creds.access_token);

  const {
    body: { id: userId }
  } = await spotify.getMe();

  const user: User = {
    userId,
    refreshToken: creds.refresh_token
  };

  const dynamo = new DynamoDB.DocumentClient();
  await dynamo
    .put({
      TableName: process.env.USERS_TABLE_NAME,
      Item: user
    })
    .promise();

  return {
    statusCode: 200,
    body: JSON.stringify(creds)
  };
}
