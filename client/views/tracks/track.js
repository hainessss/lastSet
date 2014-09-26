Template.track.helpers({
  playlists: function() {
    return Playlists.find();
  },

  playlistCount: function() {
    return Playlists.find().count();
  }
});


Template.track.events({
  'click .playlist-dropdown': function(e) {
    var track = Tracks.findOne({soundId: e.currentTarget.dataset.soundid});

    Meteor.call('addPlaylistTrack',
      this._id, track, function(error, result) {
      if (error) {
        throwError(error.reason);
      }
    });
  },

  'click .remove': function(e) {
    var track = Tracks.findOne(e.currentTarget.dataset.trackId);

    Meteor.call('deletePlaylistTrack', track function(error, result) {
      if (error) {
        throwError(error.reason);
      }
    });
  }
});
