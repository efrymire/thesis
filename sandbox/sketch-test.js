var margin = {top: 20, right: 20, bottom: 30, left: 40},
    svg = d3.select("body")
        .append('svg')
        .attr('width', window.innerWidth)
        .attr('height', window.innerHeight);
    width = +svg.attr("width"),
    height = +svg.attr("height");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// d3.csv('test-data.csv', function(error, data) {
//     if (error) throw error;
//     barchart(data);
// });
//
// function barchart(d) {
//     d.tweets = +d.tweets
//
//     console.log(height)
//     console.log(d3.max(d, function(d) { return d.tweets; }))
//
//     x.domain(d.map(function(d) { return d.date; }));
//     y.domain([0, d3.max(d, function(d) { return d.tweets; })]);
//
//     console.log(y(d.tweets[1]))
//
//     g.append("g")
//         .attr("class", "axis axis--x")
//         .call(d3.axisBottom(y))
//         .attr("transform", "translate(0," + height + ")")
//
//     g.append("g")
//         .attr("class", "axis axis--y")
//         .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".0s")))
//         .append("text")
//         .attr("transform", "rotate(-90)")
//         .attr("y", 6)
//         .attr("dy", "0.71em")
//         .attr("text-anchor", "end")
//         .text("Tweets");
//
//     g.selectAll(".bar")
//         .data(d)
//         .enter().append("rect")
//         .attr("class", "bar")
//         .attr("x", function(d) { return x(d.date); })
//         .attr("y", function(d) { return y(d.tweets); })
//         .attr("width", x.bandwidth())
//         .attr("height", function(d) { return height - (y(d.tweets)); })
// }



d3.csv("test-data.csv", function(d) {
    d.tweets = +d.tweets;
    return d;
}, function(error, data) {
    if (error) throw error;

    x.domain(data.map(function(d) { return d.date; }));
    y.domain([0, d3.max(data, function(d) { return d.tweets; })]);

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        // .call(d3.axisBottom(x))
        // .attr("transform", "rotate(90)")
        // .style("text-anchor", "start")
            // .tickSize(6, 0).tickFormat(d3.time.format("%m/%d"));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format(".0s")))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("Tweets");

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.date); })
        .attr("y", function(d) { return y(d.tweets); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.tweets); })
        // .on('mouseover',
        //     d3.select(this)
        //         .append('text')
        //         .text(function(d) {return d.tweets})
                // .attr('x', function(d) { return x(d.date)})
                // .attr('y', function(d) { return y(d.tweets)})
                // .attr("transform", "rotate(-90)")

});