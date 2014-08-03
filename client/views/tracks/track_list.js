
Template.trackList.helpers({
  tracks: function() {
    return Tracks.find();
  },
  playlists: function() {
    return Playlists.find();
  }
});

Template.trackList.events({
  'click .tracks': function() {
    console.log('test worked')
  }
});

Template.trackList.events({
  'click #playlist': function(e) {
    result = Meteor.call('getSounds',  function (error, result) {
        console.log(result);
        Template.trackList.scUSer = result;
      }
    );
    console.log('triggered')
  }

});
