Template.footer.helpers({
  albumArt: function() {
    return Session.get('albumArt');
  },

  playing: function() {
    return Session.get('playing');
  },

  tuneIn: function() {
    return Session.get('tuneIn');
  },

  nowPlaying: function() {
    if (Session.get('nowPlaying')) {
      return Playlists.findOne(Session.get('nowPlaying')).nowPlaying;
    }
  },

  progress: function() {
    return Session.get('progress');
  },

  nowPlayingTrackPosition: function() {
    if (Session.get('nowPlaying')) {
      return Playlists.findOne(Session.get('nowPlaying')).nowPlayingTrackPosition;
    }
  },

  playingTrack: function() {
    return Session.get('playingTrack');
  }
});


Template.footer.events({
  'click #forward': function(e) {
    var index = Session.get('currentTrack');
    $('#playlist').find('.track:eq(' + index + ')').removeClass('playingTrack');
    index++;
    Session.set('currentTrack', index)
    playTrack(index);
  },

  'click #play, click #pause': function() {
    var playing = Session.get('playing');
    var index = Session.get('currentTrack');

    if(Queue.getMediaType(index)) {
      if(playing) {
        $('audio')[0].pause();
      } else {
        $('audio')[0].play();
      }
    } else {
      if(playing) {
        Session.set('playing', false);
        R.player.togglePause();
      } else {
        Session.set('playing', true);
        R.player.togglePause();
      }
    }
  },

  'click #backward': function() {
    var index = Session.get('currentTrack');
    $('#playlist').find('.track:eq(' + index + ')').removeClass('playingTrack');
    index--;
    Session.set('currentTrack', index)
    playTrack(index);
  }
});



