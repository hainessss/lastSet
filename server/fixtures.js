if (Tracks.find().count() === 0) {
  Tracks.insert({
    name: 'song1',
    pid: 'aeXjTe7KfM8pDsMup',
    artist: 'Notorious BIG',
    duration: '2.34',
    track_url: 'http://kolber.github.io/audiojs/demos/mp3/01-dead-wrong-intro.mp3'
  });

  Tracks.insert({
    name: 'song2',
    pid: 'aeXjTe7KfM8pDsMup',
    artist: 'Notorious BIG',
    duration: '3.33',
    track_url: 'http://kolber.github.io/audiojs/demos/mp3/02-juicy-r.mp3'
  });

  Tracks.insert({
    name: 'song3',
    pid: 'S929S5jcRTEj8ZG84',
    artist: 'Notorious BIG',
    duration: '4.23',
    track_url: 'http://kolber.github.io/audiojs/demos/mp3/03-its-all-about-the-crystalizabeths.mp3'
  });
}

if (Playlists.find().count() === 0) {
  Playlists.insert({
    name: 'My Biggie Playlist',
    admin_id: '1'
  });
}
