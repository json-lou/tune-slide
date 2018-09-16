// TUNESLIDE

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node'),
    redirectUri = 'http://localhost:8888/callback',
    clientSecret = '73d6497dbb394772a12f0bdeb0d94318',
    clientId = '0e7af034e26d4e24adf7f3deb85dc48d';

spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });

// Spotify access token setup
var userId = 'brittanylau'; // remove when done testing
var accessToken = 'BQBTXKRWKu8_g8iaD3dGL0iRu4s5Oq5vDW0FJf2PgKUuYSLBsNCBjTHtVWEaY2-MoPEX2olAn6bD-cUdSsTD9As5uRI2zJjpWF0N5fyljzkroF_AVtN2fKfenfQu0KbumAgszWXb22bTbZ6CCzcuMRbFJtnr796QL1M3p2nogBciVZd2kKegkmtsgdz3Kx7QaoELcgQGK84467BI4lhrvAyDN4qkzk7l';
spotifyApi.setAccessToken(accessToken);

// Mongo setup
var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    url = "mongodb://localhost:27017/tuneslide";

// User input (test values)

var myPlistName = 'Tuneslide'; 
var myPlistDescription;
var ps = {
    length: 100,
    content: true,
    privacy: true
}

var ts = {
    acousticness: 0.182,
    danceability: 0.79,
    instrumentalness: 0.00000706,
    tempo: 170.023,
    valence: 0.267
};

// ============================================================================

function createPlaylist() {
    spotifyApi.createPlaylist(userId, myPlistName, { 'public': false }, function (err) {
        if (err) {
            console.log('Error creating playlist', err);
        }
    })
}

function dbReset() {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.db("tuneslide").collection("tracks").deleteMany({});
        db.close();
    });
}

function getPlaylists() {
    spotifyApi.getUserPlaylists(userId)
        .then(function (data) {
            var playlists = data.body.items;
            var length = playlists.length; // maximum from the API is 20 playlists
            playlists.forEach(function (element, index) {
                playlists[index] = { name: element.name, id: element.id }; // name is really only for testing purposes
            })

            console.log('Successfully retrieved ' + length + ' playlists:');
            console.log(playlists);

            playlists.forEach(function (element) {
                getTracks(userId, element.id);
            })
        },
            function (err) {
                console.log('Error retrieving user playlists.', err)
            })
}

function getTracks(userId, playlistId) {
    spotifyApi.getPlaylistTracks(userId, playlistId, {
        offset: 0,
        limit: 100, // maximum by the API
        fields: 'items(track(id))' // returns array of track objects with ID field
    })
        .then(function (data) {
            var tracks = data.body.items;
            // Create an array of the track IDs in the playlist
            tracks.forEach(function (element, index) {
                tracks[index] = element.track.id;
            })
            getFeatures(tracks, ts);
        },
            function (err) {
                console.log('Error retrieving playlist tracks', err);
            })
}

function getFeatures(tracks, ideal) {
    spotifyApi.getAudioFeaturesForTracks(tracks)
        .then(function (data) {
            var features = data.body.audio_features;

            // Determine match score and create track features docs
            features.forEach(function (element, index) {
                var score = ( // error received saying "Cannot read property 'acousticness' of null"
                    Math.abs(ideal.acousticness - element.acousticness) +
                    Math.abs(ideal.danceability - element.danceability) +
                    Math.abs(ideal.instrumentalness - element.instrumentalness) +
                    Math.abs(ideal.tempo - element.tempo) / ideal.tempo +
                    Math.abs(ideal.valence - element.valence)
                );
                features[index] = {
                    id: element.id, 
                    acousticness: element.acousticness,
                    danceability: element.danceability,
                    instrumentalness: element.instrumentalness,
                    tempo: element.tempo,
                    valence: element.valence,
                    score: score
                }
            })

            // Insert track features docs into tuneslide.tracks
            MongoClient.connect(url, function (err, db) {
                if (err) throw err;
                db.db("tuneslide").collection("tracks").insertMany(features, function (err) {
                    if (err) throw err;
                })
                db.close();
            })
        }, function (err) {
            console.log('Error retrieving track features', err);
        })
}

function tuneslide() {
    console.log("\nWelcome to Tuneslide, " + userId + "!\n");
    // createPlaylist();
    dbReset();
    getPlaylists();
}

tuneslide();