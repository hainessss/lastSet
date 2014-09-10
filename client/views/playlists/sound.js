Template.sound.helpers({
  playlists: function() {
    return Playlists.find();
  }
});


Template.sound.events({
  'click .playlist-dropdown': function(e) {
    e.preventDefault();

    var sound = Sounds.findOne({soundId: parseInt(e.currentTarget.dataset.soundid)});

    Meteor.call('addPlaylistTrack',
      this._id, sound, function(error, result) {
      if (error) {
        return alert(error.reason);
      }

      Queue.update();
    });
  }
});
