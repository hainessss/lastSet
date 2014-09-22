Template.rdio.helpers({
  sounds: function() {
    return Sounds.find({type: 'rdio'});
  },

  rdioLoaded: function() {
    return Session.get('rdioLoaded');
  }
});

