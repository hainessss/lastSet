Tracks = new Meteor.Collection('tracks');


Meteor.methods({
  addPlaylistTrack: function(playlistId, trackData) {
    var user = Meteor.user();
    var sound = trackData;
    var trackAlreadyExists = Tracks.findOne({soundId: sound.soundId, pid: playlistId});

    if(!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if(!sound) {
      throw new Meteor.Error(422, "Your must have a valid track to add");
    }

    if(trackAlreadyExists) {
      throw new Meteor.Error(422, "This track already exits in this playlist");
    }

    var track = _.extend(_.pick(sound, 'soundId', 'track_url', 'artist', 'name', 'artwork_url', 'duration'),
      {pid: playlistId, submitted: new Date().getTime(), nowPlaying: null, contributer: user._id, type: 'track'
    });

    Tracks.insert(track);

    return playlistId;
  },

  deletePlaylistTrack: function(track) {
    var playlist = Playlists.findOne(track.pid);
    var user = Meteor.user();

    if (playlist.userId !== user._id || track.contributer !== user._id) {
      throw new Meteor.Error(422, "You must be the playlist admin or have contributed the song to remove it");
    }

    return Tracks.remove({_id: track._id});
  }
});

Tracks.allow({
  insert: function(userId, doc) {
    return !! userId;
  }
});


