// Spotify access token retrieval

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node'),
    scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public'],
    redirectUri = 'http://localhost:8888/callback',
    clientSecret = '73d6497dbb394772a12f0bdeb0d94318',
    clientId = '0e7af034e26d4e24adf7f3deb85dc48d';
    spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });

// ============================================================================

// Generate auth URL, visit URL to get Authorization Code
var authorizeURL = spotifyApi.createAuthorizeURL(scopes);
console.log('Authorize URL : ' + authorizeURL);

var code = 
'AQBR7q15foew9Mfo4RLipa0nIpl6SapfU09OZK4oWCeWaCCTvZVQcLSSe6IqK0g04givtOM-csAVaqM0sNYEvpAM_Tg0_UO-addNWTb8I_fhnZfV9bygppyAHrDNaCFJOvmetvl7gP3VTsIlM1h4e4QiwvvK7idw8Bldfm9hCvXy3RT0IZAwlVln3b0m3OQBjZn29EhqQsVznxjqcOO8B12VPLfR55HE5KoGZo0pJAcYoMTg-NIbv-lzC7_jt17dIUVIX1tV5bTy9BzOSEKOPHTvjv7986kQ3UxJNzcezNEdDHo0ntDGWRQWmLjMjPHHWVqostW-FOlZMmo';

spotifyApi.authorizationCodeGrant(code).then(
    function(data) {
        console.log('The token expires in ' + data.body['expires_in']);
        console.log('The access token is ' + data.body['access_token']);
        console.log('The refresh token is ' + data.body['refresh_token']);
        
        // Set the access token on the API object to use it in later calls
        spotifyApi.setAccessToken(data.body['access_token']);
        spotifyApi.setRefreshToken(data.body['refresh_token']);
    },
    function(err) {
        console.log('Error with authentication code.', err);
    }
);

