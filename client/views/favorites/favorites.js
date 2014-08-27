Template.favorites.helpers({
  sounds: function() {
    return Sounds.find({type: 'soundcloud'});
  },

  soundsLoaded: function() {
    return Session.get('soundsLoaded');
  }
});
