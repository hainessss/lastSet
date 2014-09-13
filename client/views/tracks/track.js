Template.track.helpers({
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
        throwError(error.reason);
      } else {
        //updates Queue if it the playlist a song was added to is currently playing
        if (result === Queue.playlistId) {
          Queue.update(result);
        }
      }
    });
  }
});
