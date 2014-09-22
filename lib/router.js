Router.configure({
  layoutTemplate: 'layout',
  waitOn: function() { return [Meteor.subscribe('tracks', Queue.playlistId), Meteor.subscribe('playlists', Meteor.userId()), Meteor.subscribe('collaborations', Meteor.userId()), Meteor.subscribe('notifications', Meteor.userId())] }
});

Router.map(function() {
  this.route('home', {
    path: '/'
  });

  this.route('playlist', {
    path: '/playlist/:_id',
    waitOn: function() {
      return [Meteor.subscribe('tracks', this.params._id), Meteor.subscribe('playlist', this.params._id)]
    },
    data: function() { return Playlists.findOne(this.params._id) }
  });

  this.route('favorites', {
    path: '/soundcloud'
  });

  this.route('rdio', {
    path: '/rdio'
  });

  this.route('friends', {
    path: '/friends'
  });

  this.route('search', {
    path: '/search'
  });

  this.route('about', {
    path: '/about'
  });
});

var getSounds = function() {
  if(!Session.get('soundsLoaded')) {
    Meteor.call('getSounds', function() {
      Session.set('soundsLoaded', true)
    });
  }
}


  var getCollection = function() {
    if(!Session.get('rdioLoaded')) {
      R.ready(function() {
        R.request({
          method: 'getTracksInCollection',
          content: {
            user: R.currentUser.attributes.key,
            start: 0,
            count: 50
          },
          success: function(response) {
            var tracks = response.result;
            for (var i = 0; i < tracks.length; i++) {
              Sounds.insert({
               soundId: tracks[i].key,
               artist: tracks[i].artist,
               name: tracks[i].name,
               artwork_url: tracks[i].icon,
               duration: tracks[i].duration,
               type: 'rdio',
               source: 'rdioApi'
              });
            }
            Session.set('rdioLoaded', true);
          },
          error: function(response) {
            throwError(response.message);
          }
        });
      });
    }
  };


var getFriends = function(pause) {
  Meteor.call('getFriendsData', function(err, result) {
    var friends = [];
    console.log(result);
    for (var i = 0; i < result.data.length; i++) {
      friends.push(result.data[i].id);
    };

    Session.set('friends', friends);
    Session.set('friendsData', result.data);
    Session.set('friendsLoaded', true);
  });

  if (!Session.get('friendsLoaded')) {
    pause();
  } else{
     this.subscribe('friendsPlaylists', Session.get('friends'));
  }
}

Router.onBeforeAction('loading');
Router.onBeforeAction(function() { clearErrors() });
Router.onAfterAction(getSounds, {only: 'favorites'});
Router.onAfterAction(getCollection, {only: 'rdio'});
Router.onBeforeAction(getFriends, {only: 'friends'});

