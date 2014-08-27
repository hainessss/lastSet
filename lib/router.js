Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return [Meteor.subscribe('tracks'), Meteor.subscribe('playlists', Meteor.userId()), Meteor.subscribe('collaborations', Meteor.userId())] }
});

Router.map(function() {
  this.route('trackList', {
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

  this.route('friends', {
    path: '/friends'
  });

  this.route('search', {
    path: '/search'
  });

  this.route('hypes', {
    path: '/hypem'
  });
});

var getSounds = function() {
  Meteor.call('getSounds',  function (error, result) {
    console.log(JSON.parse(result.content).id);
    HTTP.call('GET', 'http://api.soundcloud.com/users/' + JSON.parse(result.content).id + '/favorites.json?client_id=89625b1333ea9f17f401731e84eb3382',
      function(error, result) {
       console.log(result.data);
       for (var i = 0; i < result.data.length; i++) {
         Sounds.insert({soundId: result.data[i].id, track_url: result.data[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382', artist: result.data[i].user.username, name: result.data[i].title, type: 'soundcloud'});
       }
       Session.set('soundsLoaded', true);
    });
  });
}

var getFriends = function(pause) {
  Meteor.call('getFriendsData', function(err, result) {
    var friends = [];
    for (var i = 0; i < result.data.length; i++) {
      friends.push(result.data[i].id);
    };

    Session.set('friends', friends);
    Session.set('friendsData', result.data);
    Session.set('friendsLoaded', true);
  });

  if(!Session.get('friendsLoaded')){ pause(); }
  else{
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

var searchRdio = function() {
  Meteor.call('searchRdio', function(error, result) {
    console.log(result);
  });
}

var refreshSearch = function() {
  Session.set('soundsLoaded', true);
}

Router.onBeforeAction('loading');
Router.onBeforeAction(function() { clearErrors() });
Router.onBeforeAction(getSounds, {only: 'favorites'});
Router.onBeforeAction(getFriends, {only: 'friends'});
// Router.onBeforeAction(searchTiny, {only: 'search'})
Router.onBeforeAction(refreshSearch, {only: 'search'});
Router.onBeforeAction(searchRdio, {only: 'search'});
