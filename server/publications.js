Meteor.publish('tracks', function() {
  return Tracks.find();
});

Meteor.publish('playlists', function() {
  return Playlists.find();
});
