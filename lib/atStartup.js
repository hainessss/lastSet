//Loads necessary Rdio API and binds events to Rdio player
if (Meteor.isClient) {
  Meteor.startup(function () {
    Meteor.Loader.loadJs("https://www.rdio.com/api/api.js?helper=/helper.html&client_id=6_TnF7zv2TXtq30JW1w2xA",
      function() {
        R.ready(function() {
          R.player.on("change:playingTrack", function(track) {

            //trigger necessary playing functions and variable changes
            Session.set('playing', true);
            Session.set('nowPlaying', false);
            Session.set('albumArt', Queue.tracks[Session.get('currentTrack')].artwork_url);

            //this allows for collaborators to tune into the admins playlist
            if(Queue.isTrack(Session.get('currentTrack')) && Queue.playlistOwner() === Meteor.userId()) {
              Playlists.update(Queue.playlistId, {$set: {nowPlaying: Queue.tracks[Session.get('currentTrack')]}});
            }
          });

          R.player.on("change:position", function(position) {
            //sets progress bar
            var duration = this._model.attributes.playingSource.attributes.duration;
            var progress = ((position/duration) * 100) + '%';
            Session.set('progress', progress);

            addPlayingClass();

            //sets global track position
            if(Queue.isTrack(Session.get('currentTrack')) && Queue.playlistOwner() === Meteor.userId()) {
              Playlists.update(Queue.playlistId, {$set: {nowPlayingTrackPosition: progress}});
            }

            //triggers the end of a track
            var trackDuration = Queue.tracks[Session.get('currentTrack')].duration;
            if (position === trackDuration - 1) {
              console.log('ended');
              var index = Session.get('currentTrack');
              $('#playlist').find('.track:eq(' + index + ')').removeClass('playingTrack');
              index++;
              Session.set('currentTrack', index);
              playTrack(index);
            }
          });

          if (R.currentUser.attributes.canStreamHere) {
            Session.set('rdioUser', true);
          }
        });
    });
  });
}
