Meteor.publish('tracks', function() {
  return Tracks.find();
});

Meteor.publish('playlists', function(userId) {
  return Playlists.find({userId: userId});
});

Meteor.publish('comments', function(playlistId) {
  return Comments.find({playlistId: playlistId});
});


