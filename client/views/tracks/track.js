Template.track.helpers({
  comments: function() {
    return Comments.find({trackId: this._id});
  },

  playlists: function() {
    return Playlists.find();
  }
});


Template.track.events({
  'click .playlist-dropdown': function(e) {
    e.preventDefault();

    var sound = Sounds.findOne({soundId: parseInt(e.currentTarget.dataset.soundid)});

    Meteor.call('addPlaylistTrack',
      this._id, sound, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  }
});
