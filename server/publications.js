Meteor.publish('tracks', function() {
  return Tracks.find();
});

Meteor.publish('playlists', function(userId) {
  return Playlists.find({userId: userId});
});

Meteor.publish('collaborations', function(userId) {
  return Playlists.find({collaborators: userId});
});

Meteor.publish('playlist', function(id) {
  return Playlists.find({_id: id});
});

Meteor.publish('friendsPlaylists', function(userList) {
  return Playlists.find({FB_id: {$in: userList}});
});


Meteor.publish('comments', function(playlistId) {
  return Comments.find({playlistId: playlistId});
});

Meteor.publish("userData", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
                             {fields: {'services.facebook.id': 1}});
  } else {
    this.ready();
  }
});
