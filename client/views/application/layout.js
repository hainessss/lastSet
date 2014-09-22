//this global object contains the logic for an updating queue of tracks
Queue = {
  tracks: [],
  playlistId: null,

  playlistOwner: function() {
    if(this.playlistId.length > 10) {
      return Playlists.findOne(this.playlistId).userId;
    }
  },

  get: function() {
    return this.tracks;
  },

  isTrack: function(index) {
    if (this.tracks[index].type === 'track') {
      return true;
    } else {
      return false;
    }
  },

  getMediaType: function(index) {
    if (this.tracks[index].track_url) {
      return true;
    } else {
      return false;
    }
  },

  update: function(playlistId) {
    this.playlistId = playlistId;

    //simple check to see whether or not playlistId is an _.id hash
    if(playlistId.length > 10) {
      this.tracks = Tracks.find({pid: playlistId}).fetch();
      Session.set('currentPlaylist', playlistId);
    } else {
      this.tracks = Sounds.find({type: playlistId}).fetch();
      Session.set('currentPlaylist', playlistId);
    }
  }
};


Template.layout.rendered = function() {
  $('.navbar-collapse').addClass('collapse');


  //automatically updates que when track is added.
  Tracker.autorun(function() {
    if (Session.get('currentPlaylist').length > 10) {
      Queue.tracks = Tracks.find({pid: Session.get('currentPlaylist')}).fetch();
    }
  });

  //html5 player logic
  Audio = $('audio').bind('play', function() {
            Session.set('playing', true);

            //set album art and update playlist with current song
            Session.set('albumArt', Queue.tracks[Session.get('currentTrack')].artwork_url);

            if (Queue.isTrack(Session.get('currentTrack')) && Queue.playlistOwner() === Meteor.userId()) {
              Playlists.update(Queue.playlistId, {$set: {nowPlaying: Queue.tracks[Session.get('currentTrack')]}});
            }
          }).bind('pause', function() {
            Session.set('playing', false);
          }).bind('error', function() {
            $('audio').trigger("ended");
          }).bind('timeupdate', function() {
            var progress = ((this.currentTime/this.duration) * 100) + '%';
            Session.set('progress', progress);
            addPlayingClass();

            if (Queue.isTrack(Session.get('currentTrack')) && Queue.playlistOwner() === Meteor.userId()) {
              Playlists.update(Queue.playlistId, {$set: {nowPlayingTrackPosition: progress}});
            }
          }).bind('ended', function() {
            Session.set('playing', false);
            $('#playlist').find('.track:eq(' + Session.get('currentTrack') + ')').removeClass('playingTrack');

            if((Session.get('currentTrack') + 1) < Queue.tracks.length) {
                var index = Session.get('currentTrack');
                index++;
                Session.set('currentTrack', index);
                playTrack(index);
            } else {
                Audio.pause();
                index = 0;
                loadTrack(index);
            }
      }).get(0);

  //adds playing class
  addPlayingClass = function() {
    var playlistId = $('#playlist').attr("data-id");

    if (Queue.playlistId === playlistId) {
      $('#playlist').find('.track:eq(' + Session.get('currentTrack') + ')').addClass('playingTrack');
    }
  }

  //loads a track into the html5 api
  loadTrack = function(currentTrack) {
    Session.set('currentTrack', currentTrack);
    Audio.src = Queue.tracks[Session.get('currentTrack')].track_url;
  };

  //plays a track on either html5 of Rdio API
  playTrack = function(currentTrack) {
    var track = Queue.tracks[currentTrack];
    Session.set('playingTrack', track);

    //determines wether to use HTML5 audio api or Rdio API
    if (track.track_url) {
      R.player.pause();
      loadTrack(currentTrack);
      Audio.play();
    } else {
      Audio.pause();
      R.player.play({source: track.soundId});
    }
  };
};

Template.layout.helpers({
  playlists: function() {
    return Playlists.find({userId: Meteor.userId()}, {sort: {submitted: 1}});
  },

  collaborations: function() {
    return Playlists.find({collaborators: Meteor.userId()});
  },

  notifications: function() {
    return Notifications.find({read: false});
  },

  notificationsCount: function() {
    return Notifications.find({read: false, userId: Meteor.userId()}).count();
  },

  activeForm: function() {
    return Session.get('activeForm');
  },

  scUser: function() {
    return Session.get('scUser');
  },

  rdioUser: function() {
    return Session.get('rdioUser');
  }
});


Template.layout.events({
  //plays track. identifies current playlist and track index and updates queue and index
  'click .track-link': function(e){
    e.preventDefault();

    //overrides tune in feature
    if (Session.get('tuneIn')) {
      $('#tune').trigger('click');
    }

    var playlistId = $(e.currentTarget).parents('#playlist').attr("data-id");
    Queue.update(playlistId);
    var currentTrack = $(e.currentTarget).parents('#playlist').find('.track-link').index(e.currentTarget);
    $('#playlist').find('.track:eq(' + Session.get('currentTrack') + ')').removeClass('playingTrack');
    Session.set('currentTrack', currentTrack);

    playTrack(currentTrack);
  },

  //create new playlist
  'submit #playlist-form form': function(e) {
    e.preventDefault();
    Session.set('activeForm', true);

    var playlist = {
      name: $(e.target).find('input').val()
    }

    Meteor.call('createPlaylist', playlist, function(error, id) {
      if (error) {
        throwError(error.reason);
      } else {
        Router.go('playlist', {_id: id})
      }
    });

    Session.set('activeForm', false);
  },

  //calls search across soundcloud and rdio api
  'submit #song-search form': function(e) {
    e.preventDefault();
    Session.set('searchLoaded', false);

    Sounds.remove({type: 'search'});

    var query = $(e.target).find('input').val();
    $(e.target).find('input').val('');

    Meteor.call('searchSounds', query, function(error, result) {
      Session.set('searchLoaded', true);
    });

    if (R.currentUser.attributes.canStreamHere) {
      Meteor.call('searchRdio', query, function(result) {
        Session.set('searchLoaded', true);
      });
    }

    Router.go('search');
  },

  //toggles the display of the create playlist form
  'click #add-playlist': function(e) {
    if(Session.get('activeForm')) {
      Session.set('activeForm', false);
    } else {
      Session.set('activeForm', true);
      $('input[name=addPlaylist]').focus();
    }
  },

  //determines wether a user has entered their soundcloud username
  'click #scUser': function(e) {
    var scUser = Meteor.user().scUser;

    if (scUser) {
      Router.go('favorites');
    } else {
      Session.set('scUser', true);
    }
  },

  //authenticates the rdio api and saves rdio username
  'click #rdioUser': function(e) {
    e.preventDefault();

    R.authenticate(function(nowAuthenticated) {
      if (R.currentUser.attributes.canStreamHere) {
        var username = R.currentUser.attributes.vanityName;
        Session.set('rdioUser', true);

        Meteor.call('addRdioUsername', username, function(error, result) {
          if(error) {
            throwError(error.reason);
          } else {
            Router.go('rdio');
          }
        });
      }
    });
  },

  //gets soundcloud username form user
  'submit #soundcloud-form form': function(e) {
    e.preventDefault();

    var username = {
      scUsername: $(e.target).find('input').val()
    }

    Meteor.call('addScUsername', username, function(error, result) {
      if(error) {
        throwError(error.reason);
      } else {
        Router.go('favorites');
        Session.set('scUser', false);
      }
    });
  },

  'click .notification': function(e) {
    Meteor.call('clearNotifications');
  }
});

//clears session memory in regards to below variables
Template.layout.created = function() {
  Session.set('soundsLoaded', false);
  Session.set('rdioLoaded', false);
  Session.set('progress', 0 + '%');
  Session.set('albumArt', null);
  Session.set('playingTrack', null);
  Session.set('playing', null);
  Session.set('currentPlaylist', 'none');
};

