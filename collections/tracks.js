Tracks = new Meteor.Collection('tracks');


Meteor.methods({
  addPlaylistTrack: function(playlistId, trackData) {
    var user = Meteor.user();
    var sound = trackData;
    var trackAlreadyExists = Tracks.find({})

    if(!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if(!sound) {
      throw new Meteor.Error(422, "Your must have a valid track to add");
    }

    var track = _.extend(_.pick(sound, 'soundId', 'track_url', 'artist', 'name', 'artwork_url', 'duration'),
      {pid: playlistId, submitted: new Date().getTime(), nowPlaying: null, type: 'track'
    });

    Tracks.insert(track);

    return playlistId;
  }
});

Tracks.allow({
  insert: function(userId, doc) {
    return !! userId;
  }
});


