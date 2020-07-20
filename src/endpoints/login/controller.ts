import Spotify from 'spotify-web-api-node';

export default async function controller() {
  const spotify = new Spotify({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID
  });

  const authorizeURL = spotify.createAuthorizeURL(
    process.env.SPOTIFY_SCOPES.split(','),
    process.env.SPOTIFY_STATE
  );

  return {
    statusCode: 302,
    headers: {
      Location: authorizeURL
    }
  };
}
