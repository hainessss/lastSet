Meteor.methods({
  searchSounds: function(query) {
    SC.initialize({
      client_id: "89625b1333ea9f17f401731e84eb3382"
    });

    SC.get('/tracks', { q: query, limit: 4 }, function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        Sounds.insert({soundId: tracks[i].id, track_url: tracks[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382', name: tracks[i].title, artwork_url: tracks[i].artwork_url, type: 'search'});
      };
    });
  },

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
            Sounds.insert({trackKey: tracks[i].key, artist: tracks[i].artist, name: tracks[i].name, artwork_url: tracks[i].icon, duration: tracks[i].duration * 1000, type: 'search'});
          };
        },
        error: function(response) {
          return response;
        }
      });
    });
  }
});
