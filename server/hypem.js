Meteor.methods({
  getHypemFavs: function() {
    var Hypem = Meteor.require("node-hypem");
    var favorites = Meteor.sync(function(done) {
      Hypem.user('remixisking').loved(1, function(err, data) {
        done(null, data);
      });
    });
    return favorites.result;
  }
});


