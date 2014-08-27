
Template.trackList.helpers({
  playlists: function() {
    return Playlists.find({userId: Meteor.userId()}, {sort: {submitted: 1}});
  },

  collaborations: function() {
    return Playlists.find({collaborators: Meteor.userId()});
  }
});


