//this global object contains the logic for an updating queue of tracks
Queue = {
  tracks: [],
  playlistId: null,
  progress: 0,

  get: function() {
    return this.tracks;
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

            //pause rdio source
            R.player.pause();

            //set album art and update playlist with current song
            Session.set('albumArt', Queue.tracks[Session.get('currentTrack')].artwork_url);
            Playlists.update(Queue.playlistId, {$set: {nowPlaying: Queue.tracks[Session.get('currentTrack')]}});
          }).bind('pause', function() {
            Session.set('playing', false);
          }).bind('error', function() {
            $('audio').trigger("ended");
          }).bind('ended', function() {
            Queue.progress = 0;
            Session.set('playing', false);
            if((Session.get('currentTrack') + 1) < Queue.tracks.length) {
                var index = Session.get('currentTrack');
                index++;
                Session.set('currentTrack', index);
                loadTrack(index);
                Audio.play();
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
  Session.set('playing', false);
  Session.set('currentTrack', currentTrack);
  Audio.src = Queue.tracks[Session.get('currentTrack')].track_url;
};

playTrack = function(currentTrack) {
  loadTrack(currentTrack);
  Audio.play();
};


updateProgress = function() {
  //find duration of current track and convert to seconds
  var max = Queue.tracks[Session.get('currentTrack')].duration * .001;
  var increment = 100 / max;

  if((Queue.progress < 99) && (Session.get('playing'))) {
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
  }
});


Template.layout.events({
  'click .track-link': function(e){
    e.preventDefault();

    //clears progress bar
    Queue.progress = 0;
    if (Session.get('timeoutId')) {
      clearTimeout(Session.get('timeoutId'));
    }


    var playlistId = $(e.currentTarget).parents('#playlist').attr("data-id");
    Queue.update(playlistId);
    var currentTrack = $(e.currentTarget).parents('#playlist').find('.track-link').index(e.currentTarget);
    Session.set('currentTrack', currentTrack);

    var track = Queue.tracks[Session.get('currentTrack')];

    if (track.track_url) {
      playTrack(Session.get('currentTrack'));
    } else {
      R.player.play({source: track.trackKey});
    }
  },

  'submit #playlist-form form': function(e) {
    e.preventDefault();
    Session.set('activeForm', true);

    var playlist = {
      name: $(e.target).find('input').val()
    }

    Meteor.call('createPlaylist', playlist, function(error, id) {
      if (error) {
        throwError(error.reason);
      }

      Router.go('playlist', {_id: id})
    });

    Session.set('activeForm', false);
  },

  'submit #song-search form': function(e) {
    e.preventDefault();
    Session.set('searchLoaded', false);

    Sounds.remove({type: 'search'});

    var query = $(e.target).find('input').val();

    Meteor.call('searchSounds', query, function(error, result) {
      Session.set('searchLoaded', true);
    });

    Meteor.call('searchRdio', query, function(result) {
      console.log(result);
    });

    Router.go('search');
  },

  'click #add-playlist': function(e) {
    e.preventDefault();

    if(Session.get('activeForm')) {
      Session.set('activeForm', false);
    } else {
      Session.set('activeForm', true);
      $('input[name=addPlaylist]').focus();
    }
  },

  'click #scUser': function(e) {
    e.preventDefault();
    var scUser = Meteor.user().scUser;

    if (scUser) {
      Router.go('favorites');
    } else {
      Session.set('scUser', true);
    }
  },

  'click #rdioUser': function(e) {
    e.preventDefault();

    R.authenticate(function(nowAuthenticated) {
      Router.go('rdio');
    })
  },

  'submit #soundcloud-form form': function(e) {
    e.preventDefault();

    var username = {
      scUsername: $(e.target).find('input').val()
    }

    Meteor.call('addScUsername', username, function(error, result) {
      Router.go('favorites');
      Session.set('scUser', false);
    });
  },

  'click .notification': function(e) {
    Meteor.call('clearNotifications', function(error, result) {

    });
  }
});


Template.layout.created = function() {
  Meteor.Loader.loadJs("https://www.rdio.com/api/api.js?client_id=6_TnF7zv2TXtq30JW1w2xA",
    function() {
      console.log('loaded');
      R.ready(function() {
        R.player.on("change:playingTrack", function(track) {
          Audio.pause();
          console.log(track);
        });
      });
  });
  Session.set('soundsLoaded', false);
};

