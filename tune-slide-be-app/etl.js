var features = require('./features.js');
var fs = require('fs');

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node');
var redirectUri = 'http://localhost:8888/callback';
var clientSecret = '73d6497dbb394772a12f0bdeb0d94318';
var clientId = '0e7af034e26d4e24adf7f3deb85dc48d';
var userId = 'brittanylau';
var accessToken = 'BQAT-w02oJE4ztqjocV1vjE9-0_BDJZdKxV1aXE3jgxehiBiVsL7maZ4c3karKNE2DXOC56qVJ85PnKOuiIN8y1374_EWyma__1CloCKkw0Qaa67wAc7pzBbbg18OSzgcnRA4OYXfRX6N3WeqEZDOqIZPhqF3fNDBzj35E_rU9wnsK38ZxY76P59mZNXc7S_J6F6t64w0KBFoWq0_Mq3H3XBOVCf4Uut';
var spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });

spotifyApi.setAccessToken(accessToken);

// ============================================================================

exports.getPlaylistTracks = function(userId, plistId, plistName) {

    spotifyApi.getPlaylistTracks(userId, plistId, {
        offset: 0,
        limit: 100, // max is 100
        fields: 'items(track(id))'
    })
    .then(function(data) {
        var tracks = data.body.items;
        //console.log(tracks);
        var length = tracks.length;
        console.log('Retrieved ' + length + ' tracks from ' + plistName);
        
        // Logging
        fileName = "./data/" + plistName + ".JSON"
        fs.writeFile(fileName, JSON.stringify(tracks), function(err) {
            if (err) throw err;
        })

        // features.getTrackFeatures(tracks);

    },
    function(err) {
        console.log('Error retrieving playlist tracks', err);
    })
}

