Hypes = new Meteor.Collection('hypes');

Hypes.allow({
  insert: function(userId, doc) {
    return !! userId;
  },

  update: function(userId, doc) {
    return doc && doc.userId === userId;
  }
});
