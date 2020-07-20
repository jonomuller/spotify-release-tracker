import Spotify from 'spotify-web-api-node';

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

  const creds = await spotify.authorizationCodeGrant(code);

  return {
    statusCode: 200,
    body: JSON.stringify(creds)
  };
}
