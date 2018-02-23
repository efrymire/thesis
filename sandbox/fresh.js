
var dataset;

var w = 500,
    h = 500,
    padding = 1;

var svg = d3.select('body')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

d3.csv('test-data.csv', function(data) {
    dataset = data;
    viz(data);
});

function viz(dataset) {

    console.log(dataset)
    console.log(d3.max(dataset, function(d) { return d.tweets; }))

    var x = d3.scaleBand().range([0, w]).padding(0.1)
            .domain(dataset.map(function(d) { return d.date; })),
        y = d3.scaleLinear().range([0, h])
            .domain([0, d3.max(dataset, function(d) { return d.tweets; })]);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "bar")
        .attr('x', function(d) {
            return x(d.date)
        })
        .attr('y',function(d) {
            return h-(y(d.tweets/100))
        })
        .attr("width", x.bandwidth())
        .attr('height', function(d) {
            return y(d.tweets)/100
        });
}
