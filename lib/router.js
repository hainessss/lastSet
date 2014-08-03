Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() { return Meteor.subscribe('tracks'); }
});

Router.map(function() {
  this.route('trackList', {path: '/'});

  this.route('playlist', {
    path: '/playlist/:_id',
    data: function() { return Playlists.findOne(this.params._id) }
  });
});

Router.onBeforeAction('loading');
