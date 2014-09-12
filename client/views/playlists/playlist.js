Template.playlist.helpers({
  tracks: function() {
    var results = Tracks.find({pid: this._id}, {sort: {submitted: 1}});
    var id = this._id;
    var last = _.last(results.fetch());
    Session.set('last', last);

    return results;
  },

  ownPlaylist: function() {
    return this.userId === Meteor.userId();
  },

  isCollaborator: function() {
    return Playlists.findOne({_id: this._id, collaborators: Meteor.userId()});
  },

  nowPlaying: function() {
    var playlist = Playlists.findOne({_id: this._id});
    Session.set('nowPlaying', playlist.nowPlaying);
    return playlist.nowPlaying;
  }
});

Template.playlist.events({
  'click .delete': function(e) {

    if (confirm("Are you sure you want to delete this playlist?")) {
      var playlistId = this._id;
      var playlistAdminId = this.userId;

      Meteor.call('deletePlaylist', playlistId, playlistAdminId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });

      Router.go('favorites');
    }
  },

  'click .leave': function(e) {
    if (confirm("Are you sure you want to leave this playlist?")) {
      var playlistId = this._id;

      Meteor.call('leavePlaylist', playlistId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });
    }
  },

  'click #private': function(e) {
    if(this.private) {
      $('#private').removeClass('checked');
      Playlists.update({_id: this._id}, {$set: {private: false}});
    } else {
      $('#private').addClass('checked');
      Playlists.update({_id: this._id}, {$set: {private: true}});
    }
  },

  'click #tune': function(e) {
    e.preventDefault();

    if(Session.get('tuneIn')) {
      Session.set('tuneIn', false);
      Session.set('nowPlaying', null);
      $('#tune').removeClass('checked');
    } else {
      Session.set('tuneIn', true);
      Session.set('nowPlaying', this._id);
      $('#tune').addClass('checked');
    }
  }
});



//checks the radio buttons if a playlist has been set to private
//also it resets the tune-in function
Template.playlist.rendered = function() {
    var playlistId = this.find('#playlist').dataset.id;
    var playlist = Playlists.findOne({_id: playlistId});

    if (playlist.private) {
      $('#private').addClass('checked');
    }

    if(Session.get('tuneIn')) {
      $('#tune').trigger('click');
    }
};
