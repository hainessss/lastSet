Template.search.helpers({
  searchResults: function() {
    return Sounds.find({type: 'search'});
  },

  searchLoaded: function() {
    return Session.get('searchLoaded');
  },

  soundsLoaded: function() {
    return Session.get('soundsLoaded');
  }
});
