Meteor.methods({
  getGroove: function(songInfo) {
    var GS = Meteor.require("grooveshark-streaming");
    var url = Meteor.sync(function(done) {
      GS.Grooveshark.getStreamingUrl(songInfo.SongID, function(err, streamUrl) {
        done(null, streamUrl);
      });
    });
    return url.result;
  },

  getGrooveDos: function(songInfo) {
    var groovr = Meteor.require('groovr');
    var song = Meteor.sync(function(done) {
      groovr.getSongFile(songInfo.SongID, function (err, file) {
        done(null, file);
      });
    });
    return song.result;
  }
});
