Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return [Meteor.subscribe('tracks'), Meteor.subscribe('playlists', Meteor.userId())] }
});

Router.map(function() {
  this.route('trackList', {
    path: '/'
  });

  this.route('playlist', {
    path: '/playlist/:_id',
    waitOn: function() {
      return Meteor.subscribe('comments', this.params._id);
    },
    data: function() { return Playlists.findOne(this.params._id) }
  });

  this.route('favorites', {
    path: '/soundcloud'
  });
});

var getSounds = function() {
  Meteor.call('getSounds',  function (error, result) {
    console.log(JSON.parse(result.content).id);
    HTTP.call('GET', 'http://api.soundcloud.com/users/' + JSON.parse(result.content).id + '/favorites.json?client_id=89625b1333ea9f17f401731e84eb3382',
      function(error, result) {
       console.log(result.data);
       for (var i = 0; i < result.data.length; i++) {
         Favorites.insert({soundId: result.data[i].id, track_url: result.data[i].stream_url + '?client_id=89625b1333ea9f17f401731e84eb3382', artist: result.data[i].user.username, name: result.data[i].title});
       }
    });
  });
}

Router.onBeforeAction('loading');
Router.onBeforeAction(function() { clearErrors() });
Router.onBeforeAction(getSounds, {only: 'favorites'})
