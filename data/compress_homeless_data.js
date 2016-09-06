var fs = require('fs');
var _ = require('lodash');

var input = 'homeless.min.json';
var output = 'homeless2.min.json';

fs.readFile(input, function (err, data) {
  if (err) return console.error(err);

  var json = JSON.parse(data.toString());
  var names = [];

  var compressed = _.mapValues(json, function (d) {

    // get city index
    var city_index = names.indexOf(d.city);
    if (city_index < 0) {
      names.push(d.city);
      city_index = names.length - 1;
    }

    // get community index
    var comm_index = names.indexOf(d.comm);
    if (comm_index < 0) {
      names.push(d.comm);
      comm_index = names.length - 1;
    }

    // street = count of adults on the street
    // temp = count of people living in tents, cars, etc.
    // youth = count of youth on the street
    // unshelt_tot = street + temp + youth
    // shelt_tot = total count of people living in emergency, transitional, or safe havens
    // tot = unshelt_tot + shelt_tot

    return {
      city: [city_index, comm_index],
      ct: [d.street, d.temp, d.youth, d.unshelt_tot, d.shelt_tot, d.tot],
    };

  });

  fs.writeFile(output, JSON.stringify({names, data: compressed}),  function (err) {
    if (err) return console.error(err);
    console.log("Data written successfully!");
  });
});