import Spotify from 'spotify-web-api-node';

export function getSpotifyClient() {
  return new Spotify({
    redirectUri: process.env.SPOTIFY_REDIRECT_URI,
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET
  });
}
