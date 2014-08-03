sharedEvents = {
  'click .track-link': function(e){
    e.preventDefault();

    var audio = $('audio')[0];
    var playlist = $('#playlist');
    var tracks = playlist.find('li a');
    var url = this.url
    var currentTrack = $(e.currentTarget).index();

    var run = function(link, player) {
      player.src = link;
      player.load();
      player.play();
    };

    run(url, audio);

    audio.addEventListener('ended', function(){
      currentTrack++;
      url = playlist.find('a')[currentTrack]
      run(url, audio);
    });
  }
}
