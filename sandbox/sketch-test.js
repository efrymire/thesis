var width = window.innerWidth;
var height = window.innerHeight;

// ------- SVG --------

// set svg and global var

// var svg = d3.select('#graph').html('')
var svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

// data function

// d3.csv('date_count', function(data) {
//     var dataset = data;
//
//     dataset.forEach(function(d) {
//         d.date = Date.parse(d.date);
//         d.count = parseInt(d.count);
//     })
//
//     var x = d3.scaleBand()
//             .range([0, width])
//             .padding(0.1)
//             .domain(dataset.map(function(d) { return d.date; })),
//         y = d3.scaleLog()
//             .range([0, height])
//             .domain([1000, d3.max(dataset, function(d) { return d.count; })]);
//
//     var rect = svg.selectAll('rect')
//         .data(dataset)
//         .enter()
//         .append('rect')
//         .attr("class", "bar")
//         .attr('x', function(d) { return x(d.date) })
//         .attr('y', function(d) { return height - (y(d.count)) })
//         .attr('width', x.bandwidth())
//         .attr('height', function(d) { return y(d.count) })
//         .attr('date', function(d) { return (d.date) })
//         .attr('count', function(d) { return (d.count) })
//         .on("mouseover", mouseover)
//         .on("mousemove", mousemove)
//         .on("mouseout", mouseout);
//
//     var text = svg.selectAll('rect')
//         .append('text')
//         .text(function(d) { return d.count; })
//         .style('fill','black')
//         .attr('x', function(d) { return x(d.date) })
//         .attr('y', function(d) { return height - (y(d.count)) })
//         .attr('transform', function(d, i) { return 'translate(10, ' + (window.innerHeight-y(d.count)) + ')rotate(-90)'; });
//
//
//     var div = d3.select('body').append('div')
//         .attr('class', 'tooltip')
//         .style('display', 'none');
//
//     function mouseover() {
//         div.style('display', 'inline');
//     }
//
//     function mousemove() {
//         div
//             .text('date:' + d3.select(this).attr('date') + ', tweets:' + d3.select(this).attr('count'))
//             .style("left", (d3.event.pageX) + "px")
//             .style("top", (d3.event.pageY - 25) + "px");
//     }
//
//     function mouseout() {
//         div.style("display", "none");
//     }
//
// });

d3.csv('worthwhile', function(data) {
    var dataset = data;
    console.log(dataset)

    dataset.forEach(function(d) {
        d.date = Date.parse(d.date);
        d.likes = parseInt(d.likes);
        d.retweets = parseInt(d.retweets);
        d.replies = parseInt(d.replies);
    })

    console.log(d3.max(dataset, function(d) { return d.likes}))

    var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1)
            .domain(dataset.map(function(d) { return d.date; })),
        y = d3.scaleLog()
            .range([0, height])
            .domain([1000, d3.max(dataset, function(d) { return d.count; })]);
        l = d3.scaleLinear()
            .range([1,10])
            .domain([0, d3.max(dataset, function(d) { return d.likes; })]);


    var tweet = svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('r', function(d) { return l(d.likes)})
        .attr('cx', function(d) { return x(d.date)})
        .attr('cy', function(d) { return height - (y(d.count)) })
        .attr('date', function(d) { return (d.date) })
        .attr('likes', function(d) { return (d.likes) })
        .attr('text', function(d) { return (d.text) })
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseout", mouseout);

    var div = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('display', 'none');

    function mouseover() {
        d3.select(this).style('fill','yellow')
        div.style('display', 'inline');
    }

    function mousemove() {
        div
            .text('date:' + d3.select(this).attr('date') + ', likes:' + d3.select(this).attr('likes') + ', tweet text:' + d3.select(this).attr('text'))
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 25) + "px");
    }

    function mouseout() {
        d3.select(this).style('fill','steelblue')
        div.style("display", "none");
    }


});