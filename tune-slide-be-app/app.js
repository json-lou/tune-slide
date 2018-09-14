// TUNESLIDE

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node'),
    redirectUri = 'http://localhost:8888/callback',
    clientSecret = '73d6497dbb394772a12f0bdeb0d94318',
    clientId = '0e7af034e26d4e24adf7f3deb85dc48d';

spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });

// Spotify access token setup
var userId = 'brittanylau'; // remove when done testing
var accessToken = 'BQABRY-S9kJ3Ma4YOw_AmdSFn1TUsqpyfZRbE_EQ4r3wbe9B2tWt8JmMTvULT9FAHwx4l7ZEssDIIYe5KW4gK3V5wa4RD5Fbylh7vboweXNpr4DN8PGJBSDh7LflGYQ7b0VhmRmT8Gt7Mwe-pDkKc3RZ61M7Hss4b-TYj1IQPC6ANm2IKJcm_zjX8FHp6INnhbRw9mr4GObwhCb0ik4XWWKM7x-rMQ7t';
spotifyApi.setAccessToken(accessToken);

// Mongo setup
var mongo = require('mongodb'),
    MongoClient = mongo.MongoClient,
    url = "mongodb://localhost:27017/tuneslide";

// User input (implementing later)

var myPlistName = 'Tuneslide';
var myPlistDescription;
var plistSettings; // length, content, privacy
var trackSettings; // acousticness, danceability, instrumentalness, tempo, valence

// ============================================================================

function createPlaylist() {
    spotifyApi.createPlaylist(userId, myPlistName, { 'public': false }, function(err) {
        if (err) {
            console.log('Error creating playlist', err);
        }
    })
}

function dbReset() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        db.db("tuneslide").collection("tracks").deleteMany({});
        db.close();
    });
}
 
function getPlaylists() {
    spotifyApi.getUserPlaylists(userId)
    .then(function(data) {
        var playlists = data.body.items;
        var length = playlists.length; // maximum from the API is 20 playlists
        playlists.forEach(function(element, index) {
            playlists[index] = { name: element.name, id: element.id }; // name is really only for testing purposes
        })

        console.log('Successfully retrieved ' + length + ' playlists:');
        console.log(playlists);

        playlists.forEach(function(element) {
            getTracks(userId, element.id);
        })
    },
    function(err) {
        console.log('Error retrieving user playlists.', err)
    })
}

function getTracks(userId, playlistId) {
    spotifyApi.getPlaylistTracks(userId, playlistId, {
        offset: 0,
        limit: 100, // maximum by the API
        fields: 'items(track(id))' // returns array of track objects with ID field
    })
    .then(function(data) {
        var tracks = data.body.items;

        // Create an array of the track IDs in the playlist
        tracks.forEach(function(element, index) {
            tracks[index] = element.track.id;
        })
        
        getFeatures(tracks);
    },
    function(err) {
        console.log('Error retrieving playlist tracks', err);
    })
}

function getFeatures(tracks) {
    spotifyApi.getAudioFeaturesForTracks(tracks)
    .then(function(data) {
        var features = data.body.audio_features;

        // Include only the fields we need for querying
        features.forEach(function(element, index) {
            features[index] = {
                id: element.id, // error received saying "Cannot read property 'id' of null"
                acousticness: element.acousticness,
                danceability: element.danceability,
                instrumentalness: element.instrumentalness,
                tempo: element.tempo,
                valence: element.valence
                
            };
        })
        
        // Insert into tuneslide.tracks
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            db.db("tuneslide").collection("tracks").insertMany(features, function(err) {
                if (err) throw err;
            })
            db.close();
        })
    }, function(err) {
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