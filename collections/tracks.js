Tracks = new Meteor.Collection('tracks');

Meteor.methods({
  getSounds: function() {
    // SC.initialize({
    //     client_id: "89625b1333ea9f17f401731e84eb3382"
    // });

    // SC.get('/resolve', {
    //   url: 'https://soundcloud.com/remixisking'
    // }, function(user) {
    //   console.log(user.id);
    // });
    this.unblock();
    return HTTP.call('GET', 'http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/remixisking&client_id=89625b1333ea9f17f401731e84eb3382');
  },

  addPlaylistTrack: function(playlistId, trackData) {
    var user = Meteor.user();
    var sound = trackData;
    console.log(sound);

    if(!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if(!sound) {
      throw new Meteor.Error(422, "Your track must have a soundId");
    }

    var track = _.extend(_.pick(sound, 'soundId', 'track_url', 'artist', 'name'),
      {pid: playlistId, submitted: new Date().getTime()
    });

    track._id = Tracks.insert(track);

    return track._id;
  }
});

Tracks.allow({
  insert: function(userId, doc) {
    return !! userId;
  }
});


