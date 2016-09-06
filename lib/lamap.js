d3.json('la.json', function(error, uk) {
  if (error) return console.error(error);
  console.log(uk);
});
