// Mongo setup
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var url = "mongodb://localhost:27017/tuneslide";

// Spotify API setup
var SpotifyWebApi = require('spotify-web-api-node');
var redirectUri = 'http://localhost:8888/callback';
var clientSecret = '73d6497dbb394772a12f0bdeb0d94318';
var clientId = '0e7af034e26d4e24adf7f3deb85dc48d';
var accessToken = 'BQC9-eFZ-ljqvcNovSJuSVXn1hqN2yXAnOJ5cSfNGEarJbVMeMMgWjeVreO5vHcIxdvJ6e_5tbvrD5tOsVTMiTIbDQUh-ilaI1uhg_40AEJK9AD8xHuzD-XxCqg36nXOyccQvS-v4iwv48wvszcnywew03MS32pSQaoEvG49MIOlx4GtnxkKi6T0oO_IBhHDo-H_TcCBKDHOEKskODEWizSeB9fjnXgI';
var spotifyApi = new SpotifyWebApi({ redirectUri, clientSecret, clientId });
spotifyApi.setAccessToken(accessToken);

// ============================================================================

exports.getTrackFeatures = function(tracks) {
    tracks.forEach(function(element) {
        var trackId = element.track.id;
        spotifyApi.getAudioFeaturesForTrack(trackId)
        .then(function(data) {
            features = data.body;
            trackId = features.id;
            acousticness = features.acousticness;
            danceability = features.danceability;
            instrumentalness = features.instrumentalness;
            tempo = features.tempo;
            valence = features.valence;

            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
    
                var tuneslideDatabase = db.db("tuneslide");
                var tracksCollection = "tracks";
                
                tuneslideDatabase.collection(tracksCollection).insertOne({ 
                    trackId, acousticness, danceability, instrumentalness, tempo, valence,
                    function(err) {
                        if (err) throw err;
                    }
                });

                db.close();

            });

        }, function(err) {
            if (err) throw err;
        });
    })
}