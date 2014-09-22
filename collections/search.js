Meteor.methods({
  //makes a query Soundclouds's music catalog
  searchSounds: function(query) {
    SC.get('/tracks', { q: query, limit: 4 }, function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        Sounds.insert(
          {
            soundId: tracks[i].id.toString(),
            track_url: tracks[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382',
            artist: tracks[i].user.username,
            name: tracks[i].title,
            artwork_url: tracks[i].artwork_url,
            duration: tracks[i].duration * 0.001,
            type: 'search',
            source: 'soundcloudApi'
          }
        );
      };
    });
  },

  //gets a users favorited soundcloud tracks
  getSounds: function() {
    var user = Meteor.user();
    SC.get('/resolve', {url: 'http://soundcloud.com/' + user.scUser}, function(user) {
      SC.get('/users/' + user.id + '/favorites', function(result) {
        for (var i = 0; i < result.length; i++) {
          Sounds.insert({
           soundId: result[i].id.toString(),
           track_url: result[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382',
           artist: result[i].user.username,
           name: result[i].title,
           artwork_url: result[i].artwork_url,
           duration: result[i].duration * 0.001,
           type: 'soundcloud',
           source: 'soundcloudApi'
         });
        }
      });
    });
  },

  //makes a query Rdio's music catalog
  searchRdio: function(query) {
    R.ready(function() {
      R.request({
        method: 'search',
        content: {
          query: query,
          types: 'Track',
          count: 4
        },
        success: function(response) {
          var tracks = response.result.results;
          for (var i = 0; i < tracks.length; i++) {
            Sounds.insert({soundId: tracks[i].key, artist: tracks[i].artist, name: tracks[i].name, artwork_url: tracks[i].icon, duration: tracks[i].duration, type: 'search', source: 'rdioApi'});
          };
        },
        error: function(response) {
          return response;
        }
      });
    });
  }
});
