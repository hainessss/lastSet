Template.friends.helpers({
  friendsData: function() {
    return Session.get('friendsData');
  },

  friendsLoaded: function() {
    return Session.get('friendsLoaded');
  }
});
