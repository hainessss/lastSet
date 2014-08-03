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
    return HTTP.call('GET', 'http://api.soundcloud.com/resolve.json?url=http://soundcloud.com/remixisking&client_id=');

  }
});
