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
    var track = Tracks.findOne(e.currentTarget.dataset.trackid);
    var element = $('#playlist').find('.track-link[data-trackid=' + e.currentTarget.dataset.trackid + ']')[0];
    var removedTrackIndex = $(e.currentTarget).parents('#playlist').find('.track-link').index(element);
    var currentTrackIndex = Session.get('currentTrack');

    Meteor.call('deletePlaylistTrack', track, function(error, result) {
      if (error) {
        throwError(error.reason);
      } else {
        if (Session.get('playing')) {
          if (currentTrackIndex > removedTrackIndex) {
            $('#playlist').find('.track:eq(' + Session.get('currentTrack') + ')').removeClass('playingTrack');
            Session.set('currentTrack', currentTrackIndex - 1);
          } else if (currentTrackIndex === removedTrackIndex) {
            pauseAudio();
            $('#playlist').find('.track:eq(' + Session.get('currentTrack') + ')').removeClass('playingTrack');
          }
        }
      }
    });
  }
});
