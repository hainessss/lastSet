Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return [Meteor.subscribe('tracks'), Meteor.subscribe('playlists', Meteor.userId()), Meteor.subscribe('collaborations', Meteor.userId()), Meteor.subscribe('notifications', Meteor.userId())] }
});

Router.map(function() {
  this.route('home', {
    path: '/'
  });

  this.route('helper', {
    path: '/helper'
  });

  this.route('playlist', {
    path: '/playlist/:_id',
    waitOn: function() {
      return [Meteor.subscribe('comments', this.params._id), Meteor.subscribe('playlist', this.params._id)]
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

  this.route('hypem', {
    path: '/hypem',
    waitOn: function() {
      return Meteor.subscribe('hypes', Meteor.userId());
    }
  });
});

var getSounds = function() {
  if(!Session.get('soundsLoaded')) {
    Meteor.call('getSounds',  function (error, result) {
      HTTP.call('GET', 'http://api.soundcloud.com/users/' + JSON.parse(result.content).id + '/favorites.json?client_id=89625b1333ea9f17f401731e84eb3382',
        function(error, result) {
         console.log(result.data);
         for (var i = 0; i < result.data.length; i++) {
           Sounds.insert({
            soundId: result.data[i].id.toString(),
            track_url: result.data[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382',
            artist: result.data[i].user.username,
            name: result.data[i].title,
            artwork_url: result.data[i].artwork_url,
            duration: result.data[i].duration * 0.001,
            type: 'soundcloud'});
         }
         Session.set('soundsLoaded', true);
      });
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
            console.log(response);
            for (var i = 0; i < tracks.length; i++) {
              Sounds.insert({
               soundId: tracks[i].key,
               artist: tracks[i].artist,
               name: tracks[i].name,
               artwork_url: tracks[i].icon,
               duration: tracks[i].duration,
               type: 'rdio'});
            }
            Session.set('rdioLoaded', true);
          },
          error: function(response) {
            console.log(response);
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

var userData = function() {
  Meteor.call('getUserData', function(err, data) {
    console.log(JSON.stringify(data, undefined, 4));
  });
}

var hypeM = function() {
  Meteor.call('getHypemFavs', function(err, result) {
    console.log(result);
    for (var key in result) {
      hypeId = Hypes.insert(
        {
          userId: Meteor.userId(),
          soundId: null,
          track_url: null,
          artist: result[key].artist,
          name: result[key].title,
          artwork_url: result[key].thumb_url_medium,
          duration: result[key].time
        }
      );
      var query = result[key].artist + ' ' + result[key].title;
      query.toLowerCase();
      query = query.replace('cover', '');
      query = query.replace('feat.', '');
      query = query.replace('ft.', '');
      query = query.replace('prod.', '');
      console.log(query);
      Meteor.call('searchTinySong', query, function(err, result) {
        if(result) {
          console.log(hypeId);
          Hypes.update(hypeId, {$set: {soundId: result.songId, type: 'hypem'}});
          console.log(result);
          Meteor.call('getGroove', result, function(err, result) {
            console.log(result);
            Hypes.update(hypeId, {$set: {track_url: result}});
          });
        }
      });
    }
  });
}

var searchTiny = function() {
  Meteor.call('searchTinySong', function(err, result) {
    console.log(result);
    var song = {artist: result.ArtistName, name: result.SongName}
    for (var i = 0; i < result.length; i++) {
      Meteor.call('getGrooveDos', result[i], function(err, result) {
        console.log(result);
        Sounds.insert({track_url: result, artist: song.artist, name: song.name, type: 'tinySong'});
      });
    };
    Session.set('searchLoaded', true);
  });
}

var refreshSearch = function() {
  Session.set('soundsLoaded', true);
}

Router.onBeforeAction('loading');
Router.onBeforeAction(function() { clearErrors() });
Router.onBeforeAction(getSounds, {only: 'favorites'});
Router.onAfterAction(getCollection, {only: 'rdio'});
Router.onBeforeAction(getFriends, {only: 'friends'});
// Router.onBeforeAction(searchTiny, {only: 'hypem'});
Router.onBeforeAction(hypeM, {only: 'hypem'});
Router.onBeforeAction(refreshSearch, {only: 'search'});

