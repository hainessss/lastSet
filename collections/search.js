Meteor.methods({
  searchSounds: function(query) {
    SC.initialize({
      client_id: "89625b1333ea9f17f401731e84eb3382"
    });

    SC.get('/tracks', { q: query, limit: 4 }, function(tracks) {
      for (var i = 0; i < tracks.length; i++) {
        Sounds.insert({soundId: tracks[i].id, track_url: tracks[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382', name: tracks[i].title, type: 'search'});
      };
    });
  },

  searchRdio: function() {
    R.request({
          method: 'getTopCharts',
          content: {
            type: 'Track',
            start: 0,
            count: 1
          }}, function(data) {
            return data;
    });
  }
});
