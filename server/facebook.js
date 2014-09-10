function Facebook(accessToken) {
    this.fb = Meteor.require('fbgraph');
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    }
    this.fb.setOptions(this.options);
}

Facebook.prototype.query = function(query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function(done) {
        self.fb[method](query, function(err, res) {
            done(null, res);
        });
    });
    return data.result;
}

Facebook.prototype.getFriendsData = function() {
    return this.query('/me/friends');
}

Facebook.prototype.getUserData = function() {
    return this.query('me');
}

Facebook.prototype.getProfilePhoto = function (id) {
  return this.query('/' + id + '/picture?type=square');
}

Meteor.methods({
  getFriendsData: function(id) {
    var fb = new Facebook(Meteor.user().services.facebook.accessToken);
    var data = fb.getFriendsData();
    for (var i = 0; i < data.data.length; i++) {
      data.data[i].profilePhoto = fb.getProfilePhoto(data.data[i].id).location;
    };
    return data;
  },

  getUserData: function() {
    var fb = new Facebook(Meteor.user().services.facebook.accessToken);
    var data = fb.getUserData();
    return data;
  },

  getProfilePhoto: function(id) {
    var fb = new Facebook(Meteor.user().services.facebook.accessToken);
    var data = fb.getFriendsData(id);
    return data
  }
});
