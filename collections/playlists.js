Playlists = new Meteor.Collection('playlists');

Playlists.allow({
  update: function(userId, doc) {
    return doc && doc.userId === userId;
  }
});

toTitleCase = function(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}


Meteor.methods({
  createPlaylist: function(playlistData) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if(!playlistData.name) {
      throw new Meteor.Error(422, "Please give your playlist a name");
    }

    playlistData.name = toTitleCase(playlistData.name);

    var playlist = _.extend(_.pick(playlistData, 'name'), {
      userId: user._id,
      submitted: new Date().getTime(),
      collaborators: [],
      FB_id: user.services.facebook.id,
      private: false,
      nowPlaying: null,
      nowPlayingTrackPosition: 0
    });

    var playlistId = Playlists.insert(playlist);

    return playlistId;
  },

  //script deletes playlist
  deletePlaylist: function(playlistId, playlistAdminId) {
    var user = Meteor.user();
    var ownsPlaylist = function(userId, pfAdminId) {
      return userId === pfAdminId;
    }

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to create a new playlist");
    }

    if (!ownsPlaylist(user._id, playlistAdminId)) {
      throw new Meteor.Error(422, "You do not own this playlist, jerk!");
    }


    var playlistId = Playlists.remove(playlistId);
  },

  //this script adds a collaborator to a playlist
  addCollaborator: function(playlistId, override, playlistAdminId, joinerId) {
    var user = Meteor.user();
    var playlist = Playlists.findOne({_id: playlistId});
    var replyNeeded = playlist.private;
    var isCollaborator = _.contains(playlist.collaborators, joinerId);

    var ownsPlaylist = function(userId, pfAdminId) {
      return userId === pfAdminId;
    }

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to join a playlist");
    }

    if (isCollaborator) {
      throw new Meteor.Error(401, "You are already a collaborator on this playlist");
    }

    if (override === true) {
      var replyNeeded = false;

      if (!ownsPlaylist(user._id, playlistAdminId)) {
        throw new Meteor.Error(422, "You do not own this playlist, jerk!");
      }

      return Playlists.update({_id: playlistId}, {$push: {collaborators: joinerId}});
    }

    createNotification(playlist, user, replyNeeded);

    if(replyNeeded) {
      return
    } else {
      return Playlists.update({_id: playlistId}, {$push: {collaborators: user._id}});
    }
  },

  leavePlaylist: function(playlistId, collaborator) {
    var user = Meteor.user();

    if (!user) {
      throw new Meteor.Error(401, "You must be logged in to leave a playlist");
    }

    return Playlists.update({_id: playlistId}, {$pull: {collaborators: user._id}});
  }
});
