Template.sound.helpers({
  playlists: function() {
    return Playlists.find();
  },

  playlistCount: function() {
    return Playlists.find().count();
  }
});


Template.sound.events({
  'click .playlist-dropdown': function(e) {
    e.preventDefault();

    var sound = Sounds.findOne({soundId: e.currentTarget.dataset.soundid});

    Meteor.call('addPlaylistTrack',
      this._id, sound, function(error, result) {
      if (error) {
        throwError(error.reason);
      }
    });
  }
});
