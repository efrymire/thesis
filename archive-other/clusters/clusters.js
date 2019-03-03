
d3.select('.container')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)

var svg = d3.select('svg')

var data = [];
d3.range(475).forEach(function(el){
    data.push({
        count: Math.floor(Math.random()*14000 + 4000),
        x: Math.random() * 1000,
        y: Math.random() * 1000
    });
});
console.log(data);

svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr('r', function(d) { return d.count / 1000})
    .attr('cx', function(d) { return d.x} )
    .attr('cy', function(d) { return d.y } )
