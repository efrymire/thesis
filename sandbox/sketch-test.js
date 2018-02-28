var width = 500;
var height = 500;

// ------- SVG --------

// set svg and global var

// var svg = d3.select('#graph').html('')
var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

// this is only global because of the next graph
var colors = ['orange', 'purple', 'steelblue', 'pink', 'black'];

// data function

d3.csv('test-data.csv', function(data) {
    var dataset = data;

    dataset.forEach(function(d) {
        d.date = d.date;
        d.tweets = parseInt(d.tweets);
        d.pos = parseInt(d.pos);
        d.neg = parseInt(d.neg);
    })

    var x = d3.scaleBand()
            .range([0, width - 30])
            .padding(0.1)
            .domain(dataset.map(function(d) { return d.date; })),
        y = d3.scaleLinear()
            .range([0, height])
            .domain([0, d3.max(dataset, function(d) { return d.tweets; })]);

    // var rect = svg.selectAll('rect')
    //     .data(dataset)
    //     .enter()
    //     .append('rect')
    //     .attr("class", "bar")
    //     .attr('x', function(d) {
    //         return x(d.date)
    //     })
    //     .attr('y',function(d) {
    //         return height-(y(d.tweets))
    //     })
    //     .attr('width', x.bandwidth())
    //     .attr('height', function(d) {
    //         return y(d.tweets)
    //     });

    var posrect = svg.selectAll('rect.pos')
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "pbar")
        .attr('x', function(d) {
            return x(d.date)
        })
        .attr('y',function(d) {
            return height/2-(y(d.pos))
        })
        .attr('width', x.bandwidth())
        .attr('height', function(d) { return y(d.pos)});

    var negrect = svg.selectAll('rect.neg')
        .data(dataset)
        .enter()
        .append('rect')
        .attr("class", "nbar")
        .attr('x', function(d) {
            return x(d.date)
        })
        .attr('y',function(d) {
            return height/2
        })
        .attr('width', x.bandwidth())
        .attr('height', function(d) { return y(d.neg)})
        .attr('fill', 'red');

    // scroll activity

    // var gs = d3.graphScroll()
    //     .container(d3.select('.container-1'))
    //     .graph(d3.selectAll('container-1 #graph'))
    //     .eventId('uniqueId1')  // namespace for scroll and resize events
    //     .sections(d3.selectAll('.container-1 #sections > div'))
    //     // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
    //     .on('active', function(i){
    //         // var pos = [ {cx: width - r, cy: r},
    //         //     {cx: r,         cy: r},
    //         //     {cx: width - r, cy: height - r},
    //         //     {cx: width/2,   cy: height/2} ][i]
    //
    //         rect.transition().duration(1000)
    //         // .attrs(pos)
    //             .transition()
    //             .style('fill', colors[i])
    //     })

});