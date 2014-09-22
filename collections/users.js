Users = Meteor.users;


Meteor.methods({
  addScUsername: function(username) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to add your soundcloud username");
    }

    if (!username.scUsername) {
      throw new Meteor.Error(401, "Your username cannot be blank");
    }

    return Users.update({_id: user._id}, {$set: {scUser: username.scUsername}});
  },

  addRdioUsername: function(username) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to add your soundcloud username");
    }

    if (!username) {
      throw new Meteor.Error(401, "Your username cannot be blank");
    }

    return Users.update({_id: user._id}, {$set: {rdioUser: username}});
  }
});
