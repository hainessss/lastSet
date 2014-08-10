Comments = new Meteor.Collection('comments');

Meteor.methods({
  createComment: function(commentData) {
    var user = Meteor.user();
    var track = Tracks.findOne(commentData.trackId);

    if(!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if(!commentData.content) {
      throw new Meteor.Error(422, "Yo dog, write something");
    }

    if(!track) {
      throw new Meteor.Error(422, "Yo dog, you have to have a track to comment on");
    }

    comment = _.extend(_.pick(commentData, 'content', 'trackId', 'playlistId'), {
      userName: user.profile.name,
      userId: user._id,
      submitted: new Date().getTime()
    });

    return Comments.insert(comment);
  }
});
