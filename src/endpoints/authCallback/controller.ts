import Spotify from 'spotify-web-api-node';

import { User } from '../../models/User';
import { DynamoClient, getDynamoClient } from '../../services/dynamo';
import { getSpotifyClient } from '../../services/spotify';
import { Request } from './types';

type Dependencies = {
  spotify?: Spotify;
  userStore?: DynamoClient<User>;
};

export default function controller({
  spotify = getSpotifyClient(),
  userStore = getDynamoClient<User>(process.env.USERS_TABLE_NAME)
}: Dependencies = {}) {
  return async function (request: Request) {
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

    const { body: creds } = await spotify.authorizationCodeGrant(code);
    spotify.setAccessToken(creds.access_token);

    const {
      body: { id: userId }
    } = await spotify.getMe();

    const user = {
      userId,
      refreshToken: creds.refresh_token
    };

    await userStore.put({
      Item: user
    });

    return {
      statusCode: 200,
      body: JSON.stringify(creds)
    };
  };
}
