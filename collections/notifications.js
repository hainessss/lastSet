Notifications = new Meteor.Collection('notifications');

Notifications.allow({
  insert: function(userId, doc) {
    return !! userId;
  },

  update: function(userId, doc) {
    return doc && doc.userId === userId;
  }
});

createNotification = function(playlist, user, replyNeeded) {
  Notifications.insert({
    userId: playlist.userId,
    playlistId: playlist._id,
    playlistName: playlist.name,
    joiner: user.profile.name,
    joinerId: user._id,
    submitted: new Date().getTime(),
    replyNeeded: replyNeeded,
    read: false
  });
}

Meteor.methods({
  clearNotifications: function() {
    var notifications = Notifications.find({read: false, replyNeeded: false}).fetch();

    for (var i = 0; i < notifications.length; i++) {
      Notifications.update(notifications[i]._id, {$set: {read: true}});
    };
  }
});
