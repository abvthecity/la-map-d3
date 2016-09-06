function range(start, stop, step) {
  if (typeof stop === 'undefined') {
    stop = start;
    start = 0;
  }
  if (typeof step === 'undefined') step = 1;
  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) return [];
  var result = [];
  for (var i = start; step > 0 ? i < stop : i > stop; i += step) result.push(i);
  return result;
};

function getRandomPoint(x, y, r) {
  var rad = Math.random() * 2 * Math.PI;
  var r0 = Math.random() * r;
  var x0 = r0 * Math.cos(rad) + x;
  var y0 = r0 * Math.sin(rad) + y;
  return [x0, y0];
}

function getRandomPoints(count, x, y, r) {
  x0 = parseFloat(x);
  y0 = parseFloat(y);
  return _.map(range(count), function (i) {
    return getRandomPoint(x0,y0,r);
  });
}

var width = 1280,
  height = 800;

var svg = d3.select('body').append('svg');

d3.json('la2.json', function (err, la) {
  if (err) return console.error(err);

  var features = topojson.feature(la, la.objects.subunits).features.filter(function (d) {
    var num = parseInt(d.id);
    return ((num >= 101110) && (num <= 980031));
  });

  var projection = d3.geo.mercator()
    .center([-118.3851, 34.00])
    .scale(150000)
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
    .projection(projection);

  svg.selectAll('.subunit')
    .data(features)
  .enter().append('path')
    .attr('id', function (d) { return 'tract-' + d.id; })
    .attr('class', 'subunit')
    .attr('d', path);


  d3.json('homeless2.min.json', function (err, homeless) {
    if (err) return console.error(err);

    var homelessData = _.map(homeless.data, function (d, i) {
      var data = {
        id: i,
        city: homeless.names[d.city[0]],
        comm: homeless.names[d.city[1]],
        count: d.ct[5],
      };

      var node = document.getElementById(i);
      if (node) {
        node.onclick = function () {
          console.log(data);
        }
      }

      return data;
    });

    svg.selectAll('.points')
      .data(homelessData)
    .enter().append('g')
      .attr('class', 'points')
      .each(function (d, i) {
        var index = _.findIndex(features, ['id', d.id]);
        if (d.count > 0 && index > -1) {
          var coords = features[index].properties;
          var box = bbox(features[index]);
          var diameter = Math.max(box[2] - box[0], box[3] - box[1]);
          d3.select(this).selectAll('circle')
              .data(getRandomPoints(d.count, coords.lon, coords.lat, diameter * 2))
            .enter().append('circle')
              .attr('r', '0.5px')
              .attr('transform', function (d) {
                var proj = projection(d);
                return 'translate('+ proj +')';
              });
        }
      });
  });

});
