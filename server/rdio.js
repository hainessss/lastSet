// Meteor.methods({
//   searchRdio: function(query) {
//     var rdio = new Rdio("hcg6g4yvd59zf3pu9am3ku48", "DSmUkPkNY6");
//     var tracks = Meteor.sync(function(done) {
//       rdio.call('get', {'keys': 'a254895,a104386'}, function(err, data) {
//         done(null, data);
//       });
//     });
//     return tracks.result;
//   }
// });


// Meteor.methods({
//   searchRdio: function() {
//     var rdio = Meteor.require("rdio")(['hcg6g4yvd59zf3pu9am3ku48', 'DSmUkPkNY6']);
//     // var rdio = new Rdio(['hcg6g4yvd59zf3pu9am3ku48', 'DSmUkPkNY6']);
//     return rdio;
//     var tracks = Meteor.sync(function(done) {
//       rdio.api({method: 'getTopCharts', type: 'Track', count: 10}, function(err, data) {
//         done(null, data);
//       });
//     });
//     return tracks.result;
//   }
// });
