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
  }
});


Template.footer.events({
  'click #forward': function(e) {
    $('audio').trigger("ended");
  },

  'click .play': function() {
    var playing = Session.get('playing');

    if(playing) {
      $('audio')[0].pause();
    } else {
      $('audio')[0].play();
    }
  },

  'click #back': function() {
    var index = Session.get('currentTrack');
    index--;
    Session.set('currentTrack', index)
    playTrack(index);
  }
});



