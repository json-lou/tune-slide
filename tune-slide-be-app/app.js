var etl = require('./etl.js');
var fs = require('fs');
var glob = require('glob');

// Express setup
var express = require('express'); // Express web server framework
var app = express();

// Mongo setup
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/tuneslide";
var tuneslideDb = "tuneslide";
var tracksCollection = "tracks";

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node');
var scopes = ['playlist-read-private', 'playlist-read-collaborative', 'playlist-modify-private', 'playlist-modify-public'];
var redirectUri = 'http://localhost:8888/callback';
var clientSecret = '73d6497dbb394772a12f0bdeb0d94318';
var clientId = '0e7af034e26d4e24adf7f3deb85dc48d';
var userId = 'brittanylau';
var accessToken = 'BQAT-w02oJE4ztqjocV1vjE9-0_BDJZdKxV1aXE3jgxehiBiVsL7maZ4c3karKNE2DXOC56qVJ85PnKOuiIN8y1374_EWyma__1CloCKkw0Qaa67wAc7pzBbbg18OSzgcnRA4OYXfRX6N3WeqEZDOqIZPhqF3fNDBzj35E_rU9wnsK38ZxY76P59mZNXc7S_J6F6t64w0KBFoWq0_Mq3H3XBOVCf4Uut';
var spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });
spotifyApi.setAccessToken(accessToken);

// User input (implementing later)

var userPlistName;
var userDescription;
var plistSettings; // length, content, privacy
var trackSettings; // acousticness, danceability, instrumentalness, tempo, valence

const linebreak = '================================================================================';

// ============================================================================

console.log(linebreak);
console.log('Running Tuneslide for ' + userId + ' ...');
console.log(linebreak);

// AUTHENTICATION =============================================================

/*
console.log('Authentication token resources ...')

var authorizeURL = spotifyApi.createAuthorizeURL(scopes);

console.log('Authorize URL : ' + authorizeURL);

var code = 'AQAVaTL3tH6FNasQhPbZL45VZv146rXr2Yg7tDgzM7EReDbqdYLskcGdRFFCJsRiUtb29JhphzF0In7s-HcglD7Zmpa4haoFFG00Ug8pP3sfVkCpkw2q4RzYMkmco_7vGlb6DKcobrn1UdQLJUD5ktWoBuiRcicZMnaeQqaWoKd4sZUw1B6paupxduvIITfpZGA-R0p4gzt4XuQzqhAK9FlFb1ktB0f96lzRuGE6e42x5LrQjyHvdwNyXGS9iJFjqbU-33t4g1VDhi9B7q7yRR7TZbSZcnIIfMJLcaLbpJr_gme0W0FMMC-QcoiIyUbGFnfrW_Ts77d1Oyg';

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

console.log(linebreak);

*/

// PLAYLIST CREATION ==========================================================

/*
console.log('Creating user playlist ...');

spotifyApi.createPlaylist(userId, userPlistName, plistSettings.privacy,
    function(err, data) {
        if (err) {
            console.error('Error creating playlist');
        } else {
            console.log('Created playlist!');
        }
    }
);
*/

// RETRIEVING USER TRACKS FROM PLAYLISTS ======================================

console.log('Retrieving user tracks from playlists ...');

function dataReset() {
    var dataDir = glob('./data/*');
    if (fs.existsSync(dataDir)) {
        fs.unlinkSync(dataDir, function(err) {
            if (err) throw err;
        });
    }
}

function dbReset() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var tuneslideDb = db.db(tuneslideDb);
        tuneslideDb.collection(tracksCollection).deleteMany({});
        db.close();
    });
}
 
function getTracks() {

    dataReset();
    dbReset();

    // Retrieving user's tracks
    spotifyApi.getUserPlaylists(userId)
    .then(function(data) {

        var result = data.body.items;
        var playlists = [];

        result.forEach(function(element) {
            var playlist = { name: element.name, id: element.id }
            playlists.push(playlist);
        })

        var length = playlists.length; // maximum from the API is 20 playlists

        console.log('Successfully retrieved ' + length + ' playlists:');
        console.log(playlists);
        console.log(linebreak);

        // ETL component: extracting tracks from playlists, loading into db
        playlists.forEach(function(element) {
            etl.getPlaylistTracks(userId, element.id, element.name);
        })
    },
    
    function(err) {
        console.log('Error retrieving playlists.', err)
    })
}

getTracks();