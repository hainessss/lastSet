Template.playlist.helpers({
  tracks: function() {
    var results = Tracks.find({pid: this._id}, {sort: {submitted: 1}});
    var last = _.last(results.fetch());
    Session.set('last', last);
    return results
  },

  ownPlaylist: function() {
    return this.userId === Meteor.userId();
  }
});

Template.playlist.events({
  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Are you sure you want to delete this playlist?")) {
      var playlistId = this._id;
      var playlistAdminId = this.userId;

      Meteor.call('deletePlaylist', playlistId, playlistAdminId, function(error, result) {
        if (error) {
          return alert(error.reason);
        }
      });

      Router.go('trackList');
    }
  },

  'submit #comment-form form': function(e) {
    e.preventDefault();
    console.log('hi');
    var content = $(e.target).find('input').val();
    var lastTrack = Session.get('last');

    var comment =  {
      content: content,
      trackId: lastTrack._id,
      playlistId: this._id
    };

    Meteor.call('createComment', comment, function(error, commentId) {
      if (error) {
        return alert(error.reason);
      } else {
        $(e.target).find('input').val('')
      }
    });
  }
});
