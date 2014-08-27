Template.friend.helpers({
  playlists: function() {
    return Playlists.find({FB_id: this.id});
  }
});

Template.friend.events({
  'click .playlist-dropdown': function(e) {
    var playlistId = this._id;
    console.log(this);

    Meteor.call('addCollaborator', playlistId, function(error, result) {
      if (errror) {
        return alert(error.reason);
      }
    });
  }
});
