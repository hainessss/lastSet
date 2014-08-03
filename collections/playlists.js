Playlists = new Meteor.Collection('playlists');

Playlists.allow({
  insert: function(userId, doc) {
    //cant insert a new playlist without being logged in
    return !! userId;
  }
})
