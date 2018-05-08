
var width = window.innerWidth,
    height = window.innerHeight;

// main canvas
var mainCanvas = d3.select('#container')
    .append('canvas')
    .classed('mainCanvas', true)
    .attr('width', width)
    .attr('height', height);

var customBase = document.createElement('custom');
var custom = d3.select(customBase); // replacement of SVG

// add the data as a global variable

var dataset;

d3.csv('packing_large_half', function(data){
    dataset=data;
});

setTimeout( function() {
    console.log(dataset);
    databind(dataset)
    draw()
} , 200
);

// Set databind

function databind(data) {

    stratified = d3.stratify()(data);

    data.forEach(function (d) {
        d.parentId = parseInt(d.parentId);
        d.likes = parseInt(d.likes);
    })

    // ------- circle packing --------

    // Declare d3 layout
    var layout = d3.pack()
        .size([width, height])
        .padding(.2);

    // Layout + Data
    var root = d3.hierarchy(stratified).sum(function (d) { return parseInt(d.data.likes + 1); });
    var nodes = root.descendants();
    layout(root);

    var tweet = custom.selectAll('circle')
        .data(nodes)
        .enter()
        .append('custom')
        .attr("class", function(d,i) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
        .attr('id', function(d) { return 'id: ' + d.data.id})
        .attr('cx', function(d){ return (d.x); })
        .attr('cy', function(d){ return (d.y); })
        .attr('r', function(d){ return (d.r); })
        // .attr("fill", function(d) { return d.children ? colorCircle(d.depth) : "white"; });


    // console.log(tweet)
}

// set draw function

function draw() {

    var context = mainCanvas.node().getContext('2d');

    context.clearRect(0, 0, width, height);

    var elements = custom.selectAll('custom');

    elements.each(function(d,i){

        var node = d3.select(this);

        // console.log(node._groups[0])
        if (node._groups[0][0].className == 'node node--leaf') {
            context.fillStyle = 'rgba(70, 130, 180, 0.5)';
            context.strokeStyle = 'white';
        } else {
            context.fillStyle = 'rgba(70, 130, 180, 0)';
            context.strokeStyle = 'white';
        }

        console.log(node._groups[0][0].className)

        // context.fillStyle = 'rgba(70, 130, 180, 0.2)';
        // context.strokeStyle = 'white';
        context.beginPath();
        context.arc(node.attr("cx"), node.attr("cy"), node.attr("r"), 0, 2 * Math.PI);
        context.fill();
        context.closePath();
    })

    // console.log(elements)
}