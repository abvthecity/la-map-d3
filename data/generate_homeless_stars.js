var fs = require('fs');
var _ = require('lodash');
var turf = require('turf');
var topojson = require('topojson');
var randomPointsOnPolygon = require('random-points-on-polygon');
//
var input1 = 'la2.json';
var input2 = 'homeless2.min.json';
var output = 'homeless_stars.json';
//
var la = JSON.parse(fs.readFileSync(input1).toString());
var homeless = JSON.parse(fs.readFileSync(input2).toString());

var features = topojson.feature(la, la.objects.subunits).features.filter(function (d) {
  var num = parseInt(d.id);
  return ((num >= 101110) && (num <= 980031));
});

var output = [];

for (var feature of features) {
    var tract = feature.id;
    if (homeless.data[tract]) {
      var count = homeless.data[tract].ct[5];
      if (count >= 1) {
        var points = randomPointsOnPolygon(count, feature);
        output = _.concat(output, points);
      }
    }
}

fs.writeFile('homeless_stars.json', JSON.stringify(output),  function (err) {
  if (err) return console.error(err);
  console.log("Data written successfully!");
});
