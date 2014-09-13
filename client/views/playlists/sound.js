Template.sound.helpers({
  playlists: function() {
    return Playlists.find();
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
      } else {
        //updates queue if the sound was added to a playlist that is currently playing
        if (result === Queue.playlistId) {
          Queue.update(result);
        }
      }
    });
  }
});
