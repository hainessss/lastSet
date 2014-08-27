Template.header.events({
  'submit #song-search form': function(e) {
    e.preventDefault();
    Session.set('soundsLoaded', false);

    Sounds.remove({type: 'search'});

    var query = $(e.target).find('input').val();

    Meteor.call('searchSounds', query, function(error, result) {
      Session.set('soundsLoaded', true);
    });

    Meteor.call('searchRdio', function(error, result) {
      console.log(result);
    });

    Router.go('search');
  }
});
