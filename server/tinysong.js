Meteor.methods({
  searchTinySong: function() {
    var tinysong = Meteor.require("tinysong");
    tinysong.API_KEY = 'c345869cc7706ac6b77447f6123940e1';
    var query = Meteor.sync(function(done) {
      tinysong.s('test', 4, function(err, res) {
        done(null, res);
      });
    });
    return query.result
  }
});
