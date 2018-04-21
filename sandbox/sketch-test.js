var width = window.innerWidth,
    height = window.innerHeight

d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)

// Prepare our physical space
var g = d3.select('svg').append('g');

// Get the data from our CSV file
d3.csv('packing', function(error, data) {
    if (error) throw error;

    console.log(data)

    stratified = d3.stratify()(data);
    console.log(stratified)

    data.forEach(function(d) {
        d.parentId = parseInt(d.parentId)
        d.likes = parseInt(d.likes);
    })

    var l = d3.scaleLinear()
            .range([3,13])
            .domain([0, d3.max(data, function(d) { return d.likes; })]);


    // ------- circle packing --------

    // Declare d3 layout
    var layout = d3.pack()
        .size([width, height])
        .padding(5)

    // Layout + Data
    var root = d3.hierarchy(stratified).sum(function (d) { return (d.data.likes); });
    var nodes = root.descendants();

    console.log(nodes)

    layout(root);

    var tweet = g.selectAll('circle').data(nodes).enter().append('circle');

    // ------- draw random --------

    // tweet.attr('r', function(d) { return (d.r)})
    //     .attr('cx',function() { return (Math.random() * width)})
    //     .attr('cy', function() { return (Math.random() * height)})
    //     .style('opacity',0.3)

    // ------- draw packing --------

    tweet.attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', function (d) { return (d.r); })
        .style('opacity','0.3')

});