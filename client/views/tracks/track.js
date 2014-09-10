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

    var track = Tracks.findOne({_id: e.currentTarget.dataset.id});

    Meteor.call('addPlaylistTrack',
      this._id, track, function(error, result) {
      if (error) {
        return alert(error.reason);
      }

      Queue.update();
    });
  }
});
