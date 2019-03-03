//
// d3.csv('data.csv', function(error, data) {
//     if (error) throw error;
//
//     d3.select("#coeff")
//         .on("click", function() {
//             d3.selectAll('div.circle').remove();
//             coeff(data)});
//
//     d3.select("#indexes")
//         .on("click", function() {
//             d3.selectAll('div.circle').remove();
//             indexes(data)});
//
// });

var data = [];
d3.range(475).forEach(function(el){
    data.push({
        cluster: el,
        count: Math.floor(Math.random()*14000 + 4000),
        // x: Math.random() * 1000,
        // y: Math.random() * 1000
    });
});
console.log(data);

var width = window.innerWidth,
    height = window.innerHeight

// var clusterdiv = d3.select('div.content')
//     .selectAll('div')
//     .data(data)
//     .enter()
//     .append('div')
//     .attr('class', function(d) { return 'col-lg-1 cluster ' + d.cluster })
//     .attr('width','10')
//     .attr('height','10')
//
// var clustersvg = d3.selectAll('div.cluster')
//     .append('svg')
//     .attr('width', 5)
//     .attr('height', 5)

var svg1 = d3.select('#container1')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)


var svg2 = d3.select('#container2')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)


var svg3 = d3.select('#container3')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight)


svg1.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill','black')

svg1.append('text')
    .text('scroll down')
    .style('fill', 'white')
    .attr('x', width / 2)
    .attr('y', height - height/10)
    .on('click', function() {
        window.scrollTo({
            top: height + 10,
            behavior: 'smooth'
        });
    })

svg2.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill','blue')

svg2.append('text')
    .text('scroll down')
    .style('fill', 'white')
    .attr('x', width / 2)
    .attr('y', height - height/10)
    .on('click', function() {
        window.scrollTo({
            top: (height + 10) * 2,
            behavior: 'smooth'
        });
    })

svg2.append('text')
    .text('scroll back up')
    .style('fill', 'white')
    .attr('x', width / 2)
    .attr('y', height/10)
    .on('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    })

svg3.append('rect')
    .attr('width', width)
    .attr('height', height)
    .style('fill','red')

svg3.append('text')
    .text('scroll back up')
    .style('fill', 'white')
    .attr('x', width / 2)
    .attr('y', height/10)
    .on('click', function() {
        window.scrollTo({
            top: height + 10,
            behavior: 'smooth'
        });
    })