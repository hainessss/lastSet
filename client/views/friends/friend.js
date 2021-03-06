Template.friend.helpers({
  playlists: function() {
    return Playlists.find({FB_id: this.id});
  },

  playlistCount: function() {
    return Playlists.find({FB_id: this.id}).count();
  }
});

Template.friend.events({
  'click .playlist-dropdown': function(e) {
    var playlistId = this._id;
    var adminId = this.userId;
    var joinerId = Meteor.userId();

    Meteor.call('addCollaborator', playlistId, false, adminId, joinerId, function(error, result) {
      if (error) {
        throwError(error.reason);
      }
    });
  }
});
