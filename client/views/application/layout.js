//this global object contains the logic for an updating queue of tracks
Queue = {
  tracks: [],
  playlistId: null,
  progress: 0,

  get: function() {
    return this.tracks;
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
    } else {
      this.tracks = Sounds.find({type: playlistId}).fetch();
    }
  }
};

Template.layout.rendered = function() {
  //html5 player logic
  Audio = $('audio').bind('play', function() {
            Session.set('playing', true);

            //initiate progress bar
            updateProgress();
            Session.set('nowPlaying', false);

            //set album art and update playlist with current song
            Session.set('albumArt', Queue.tracks[Session.get('currentTrack')].artwork_url);
            Playlists.update(Queue.playlistId, {$set: {nowPlaying: Queue.tracks[Session.get('currentTrack')]}});
          }).bind('pause', function() {
            Session.set('playing', false);
            killProgress();
          }).bind('error', function() {
            $('audio').trigger("ended");
          }).bind('timeupdate', function() {
            Playlists.update(Queue.playlistId, {$set: {nowPlayingTrackPosition: Queue.progress}});
          }).bind('ended', function() {
            Queue.progress = 0;
            Session.set('playing', false);
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
}

loadTrack = function(currentTrack) {
  // $('.plSel').removeClass('plSel');
  // $('#plUL li:eq(' + id + ')').addClass('plSel');
  // npTitle.text(tracks[id].name);
  // index = id;

  Session.set('currentTrack', currentTrack);
  Audio.src = Queue.tracks[Session.get('currentTrack')].track_url;
};

playTrack = function(currentTrack) {
  //resets progress bar
  Queue.progress = 0;
  killProgress();

  var track = Queue.tracks[currentTrack];

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

//clears progress bar
killProgress = function() {
  if (Session.get('timeoutId')) {
    clearTimeout(Session.get('timeoutId'));
  }
  Session.set('timeoutId', false);
}

//initiate progress bar
updateProgress = function() {
  var max = Queue.tracks[Session.get('currentTrack')].duration;
  var increment = 100 / max;

  if((Queue.progress < 100) && (Session.get('playing'))) {
    Queue.progress += increment;
    $('#progress').css('width', Queue.progress + '%');
    Session.set('timeoutId', setTimeout(updateProgress, 1000));
  } else {
    return;
  }
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

    var playlistId = $(e.currentTarget).parents('#playlist').attr("data-id");
    Queue.update(playlistId);
    var currentTrack = $(e.currentTarget).parents('#playlist').find('.track-link').index(e.currentTarget);
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
};

