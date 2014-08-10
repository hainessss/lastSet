Template.layout.events({
  'click .track-link': function(e){
    e.preventDefault();

    var audio = $('audio')[0];
    var playlist = $('#playlist');
    var tracks = playlist.find('.track-link');
    var url = this.track_url
    var currentTrack = $(e.currentTarget).index();

    var run = function(link, player) {
      player.src = link;
      player.load();
      player.play();
    };

    run(url, audio);

    audio.addEventListener('ended', function(){
      currentTrack++;
      url = playlist.find('.track-link')[currentTrack]
      run(url, audio);
    });
  },

  'submit #playlist-form form': function(e) {
    e.preventDefault();

    var playlist = {
      name: $(e.target).find('input').val()
    }

    Meteor.call('createPlaylist', playlist, function(error, id) {
      if (error) {
        throwError(error.reason);
      }

      Router.go('playlist', {_id: id})
    });
  }
});
