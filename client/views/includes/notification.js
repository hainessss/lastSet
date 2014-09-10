Template.notification.helpers({
  replyNeeded: function() {
    return this.replyNeeded;
  }
});

Template.notification.events({
  'click #accept': function(e) {
    e.stopPropagation();

    var playlistId = this.playlistId;
    var playlistAdminId = this.userId;
    var joinerId = this.joinerId;
    var accept = true;

    Notifications.update(this._id, {$set: {read: true}});

    Meteor.call('addCollaborator', playlistId, accept, playlistAdminId, joinerId, function(error, result) {
      if (error) {
        return alert(error.reason);
      }
    });
  },

  'click #deny': function(e) {
    e.stopPropagation();

    Notifications.update(this._id, {$set: {read: true}});
  }
});
