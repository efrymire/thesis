var data = [];
d3.range(100).forEach(function(el) {
    data.push({ value: el });
});

console.log(data)

var width = window.innerHeight,
    height = window.innerWidth

var canvas = d3.select('.container-3')
    .append('canvas')
    .attr('width', width)
    .attr('height', height)

var context = canvas.node().getContext('2d');

// This is your SVG replacement and the parent of all other elements
var customBase = document.createElement('custom');
var custom = d3.select(customBase);

// Settings for a grid with 10 cells in a row,
// 100 cells in a block and 1000 cells in a row.
var groupSpacing = 4;
var cellSpacing = 2;
var offsetTop = height / 5;
var cellSize = Math.floor((width - 11 * groupSpacing) / 100) - cellSpacing;

function databind(data) {
    // Bind data to custom elements.

    // Get a scale for the colours - not essential but nice.
    // colourScale = d3.scaleSequential(d3.interpolateSpectral)
    //     .domain(d3.extent(data, function(d) { return d; }));

    var join = custom.selectAll('custom.rect')
        .data(data);

    var enterSel = join
        .enter()
        .append('custom')
        .attr('class', 'rect')
        .attr("x", function(d, i) {
            var x0 = Math.floor(i / 100) % 10, x1 = Math.floor(i % 10);
            return groupSpacing * x0 + (cellSpacing + cellSize) * (x1 + x0 * 10); })
        .attr("y", function(d, i) {
            var y0 = Math.floor(i / 1000), y1 = Math.floor(i % 100 / 10);
            return groupSpacing * y0 + (cellSpacing + cellSize) * (y1 + y0 * 10); })
        .attr('width', 0)
        .attr('height', 0);

    join
        .merge(enterSel)
        .transition()
        .attr('width', cellSize)
        .attr('height', cellSize)
        // .attr('fillStyle', function(d) { return colourScale(d); });
        .attr('fillStyle', 'rgb(50, 50, 50)');

    var exitSel = join.exit()
        .transition()
        .attr('width', 0)
        .attr('height', 0)
        .remove();

    console.log()

}


function draw() {
    // Draw the elements on the canvas.

    context.clearRect(0, 0, width, height); // Clear the canvas.

    // Draw each individual custom element with their properties.
    var elements = custom.selectAll('custom.rect');
    console.log(elements)

    // Grab all elements you bound data to in the databind() function.
    elements.each(function(d,i) { // For each virtual/custom element...

        var node = d3.select(this);
        // This is each individual element in the loop.

        context.fillStyle = node.attr('fillStyle');
        // Here you retrieve the colour from the individual in-memory node and set the fillStyle for the canvas paint

        context.fillRect(node.attr('x'), node.attr('y'), node.attr('width'), node.attr('height'));
        // Here you retrieve the position of the node and apply it to the fillRect context function which will fill and paint the square.
    }); // Loop through each element.

}

databind(data);
draw();