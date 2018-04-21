//
// new TypeIt('.type-it', { speed: 900, autoStart: true })
//     .type('#metoo.')
//     .options({speed: 300}).pause(500)
//     .break()
//     .break()
//     .type('An exploration of tweeets')
//     .delete(3)
//     .type('ts using cluster analysis.');

new TypeIt('.type-it', { speed: 100,
    strings: ['#metoo.' , 'An exploration of tweets using cluster analysis.'],
    cursor: false
})


var oldWidth = 0
function render(){
    if (oldWidth == innerWidth) return
    oldWidth = innerWidth

    var width = d3.select('#graph').node().offsetWidth,
        height = d3.select('#graph').node().offsetWidth;

    var width_full = d3.select('.container-1').node().offsetWidth,
        height_full = window.innerHeight - 40

    if (innerWidth <= 1025){
        width = innerWidth
        height = innerHeight*.7
    }

    // ------- SVG --------

    // set svg and global var

    var axisHeight = 40;

    var svg = d3.select('.container-1').html('')
        .append('svg')
        .attrs({width: width_full, height: height})
        // .attr('style','padding-left: 15px')
        // .attr('style','padding-right: 15px')

    // this is only global because of the next graph
    var colors = ['orange', 'purple', 'steelblue', 'pink'];

    var parseDate = d3.timeFormat("%m-%d-%Y");
    var axisDate = d3.timeFormat('%B')

    // data function

    d3.csv('date_count.csv', function(data) {
        var dataset = data;

        dataset.forEach(function(d) {
            d.date = Date.parse(d.date);
            d.count = parseInt(d.count);
        })

        var x = d3.scaleBand()
                .range([0, width_full])
                .padding(0.1)
                .domain(dataset.map(function(d) { return d.date; })),
            y = d3.scaleLog()
                .range([0, height - axisHeight])
                .domain([1000, d3.max(dataset, function(d) { return d.count; })]);
            // t = d3.scaleTime()
            //     .range([0, width_full])
            //     .padding(0.1)
            //     .domain([new Date(2017-10-17), new Date(2018-03-01)])

        // var xAxis = d3.axisBottom(t)
        //     .ticks(d3.timeMonths)
        //     .tickFormat(axisDate);
        //
        // svg.append("g")
        //     .attr("class", "x axis")
        //     .attr("transform", "translate(0," + (height - axisHeight) + ")")
        //     .call(xAxis);

        var g = svg.append('g')
            .attr('id', 'group')

        var group = svg.select('#group')
            .selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
            .on('mouseover', function() {
                d3.select(this).selectAll('.bar').style('fill','darkgrey')
                d3.select(this).selectAll('.tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this).selectAll('.bar').style('fill','steelblue')
                d3.select(this).selectAll('.tip').style('visibility','hidden')
            })


        bandwidth = x.bandwidth()

        var rect = group.append('rect')
            .attr("class", "bar")
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height - (y(d.count)) - axisHeight })
            .attr('width', bandwidth)
            .attr('height', function(d) { return y(d.count) })
            .attr('date', function(d) { return (d.date) })
            .attr('count', function(d) { return (d.count) })
            .style('fill','steelblue')

        var tip = group.append('text')
            .attr('class','tip')
            .text(function(d) { return 'date: ' + parseDate(d.date) + ', tweets: ' + d.count; })
            .style('fill','darkgrey')
            .style('font-style','italic')
            .style('visibility','hidden')
            .style('font-size','12')
            .style('alignment-baseline', 'hanging')
            .attr('transform',function(d) { return 'translate(' + parseInt( x(d.date)) + ', ' + (height - axisHeight - y(d.count) - 5) + ')rotate(-90)'; })


        // scroll activity

        var gs = d3.graphScroll()
            .container(d3.select('.container-1'))
            .graph(d3.selectAll('container-1 #graph'))
            .eventId('uniqueId1')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-1 #sections > div'))
            .offset(innerWidth < 900 ? innerHeight - 30 : 200)

    });

    // ------- SVG 2 --------

    var svg2 = d3.select('.container-2 #graph').html('')
        .append('svg')
        .attrs({width: width, height: height_full})

    d3.csv('packing', function(error, data) {
        if (error) throw error;
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
        var root = d3.hierarchy(stratified).sum(function (d) { return parseInt(d.data.likes + 1); });
        var nodes = root.descendants();
        layout(root);

        var node = svg2.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class','pack')


        // var tweet = svg2.selectAll('circle').data(nodes).enter().append('circle')
        //     .attr("class", function(d) { return d.children ? "node" : "leaf node"; })

        var tweet = node.append('circle')
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr('id', function(d) { return 'id: ' + d.data.id})

        var leaf = d3.selectAll('.leaf')
            .on('mouseover', function() {
                d3.select(this.parentNode).selectAll('.node').style('fill','darkblue')
                d3.select(this.parentNode).selectAll('.tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this.parentNode).selectAll('.node').style('fill','steelblue')
                d3.select(this.parentNode).selectAll('.tip').style('visibility','hidden')
            })

        var tip = d3.selectAll('.pack').append('text')
            .text(function(d) { return d.data.id })
            .attr('class','tip')
            .style('alignment-baseline','hanging')
            .style('visibility','hidden')
            .attr('transform','translate(0,10)')


        // ------- draw random --------

        tweet.attr('r', function(d) { return (d.r)})
            .style('opacity',0.3)
            // .attr('cx',function() { return (Math.random() * width)})
            // .attr('cy', function() { return (Math.random() * height)})


        // ------- draw packing --------

        // tweet.attr('r', function (d) { return (d.r); })
        //     .style('opacity',0.3)
            // .attr('cx', function (d) { return d.x; })
            // .attr('cy', function (d) { return d.y; })



        // scroll activity

        var gs2;
        gs2 = d3.graphScroll()
            .container(d3.select('.container-2'))
            .graph(d3.selectAll('.container-2 #graph'))
            .eventId('uniqueId2')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-2 #sections > div'))
            .on('active', function (i) {
                var ypos = [
                    function() { return (Math.random() * height_full)},
                    function (d) { return d.y; },
                    function (d) { return d.y; },
                    function (d) { return d.y; }
                ];

                var xpos = [
                    function() { return (Math.random() * width)},
                    function (d) { return (d.x); },
                    function (d) { return (d.x); },
                    function (d) { return (d.x); }
                ];


                tweet.transition().duration(1000)
                    .attr('cy', ypos[i])
                    .attr('cx', xpos[i])
                    .style('fill', colors[i])
            });

    });

    // ------- SVG 3 --------

    // set svg and global var

    var svg3 = d3.select('.container-3').html('')
        .append('svg')
        .attrs({width: width_full, height: height})
        .attr('style','padding-left: 15px')
        .attr('style','padding-right: 15px')

    var rect = svg3.append('rect')
        .attr('width', width_full)
        .attr('height', height)
        .attr('style','fill: steelblue')

    // data function

    // d3.csv('date_count.csv', function(data) {
    //     var dataset = data;
    //
    //     dataset.forEach(function(d) {
    //         d.date = Date.parse(d.date);
    //         d.count = parseInt(d.count);
    //     })
    //
    //     var x = d3.scaleBand()
    //             .range([0, width_full])
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
    //         .style('fill','steelblue')
    //         .on("mouseover", mouseover)
    //         .on("mousemove", mousemove)
    //         .on("mouseout", mouseout);
    //
    //     // var text = svg.selectAll('rect')
    //     //     .append('text')
    //     //     .text(function(d) { return d.count; })
    //     //     .style('fill','black')
    //     //     .attr('x', function(d) { return x(d.date) })
    //     //     .attr('y', function(d) { return height - (y(d.count)) })
    //     //     .attr('transform', function(d, i) { return 'translate(10, ' + (window.innerHeight-y(d.count)) + ')rotate(-90)'; });
    //
    //
    //     var div = d3.select('body').append('div')
    //         .attr('class', 'tooltip')
    //         .style('display', 'none');
    //
    //     function mouseover() {
    //         d3.select(this).style('fill','darkblue')
    //         div.style('display', 'inline');
    //     }
    //
    //     function mousemove() {
    //         div
    //             .text('date:' + parseDate(d3.select(this).attr('date')) + ', tweets:' + d3.select(this).attr('count'))
    //             .style("left", (d3.event.pageX) + "px")
    //             .style("top", (d3.event.pageY - 25) + "px");
    //     }
    //
    //     function mouseout() {
    //         d3.select(this).style('fill','steelblue')
    //         div.style("display", "none");
    //     }
    //
    //
    //     // scroll activity
    //
    //     var gs = d3.graphScroll()
    //         .container(d3.select('.container-1'))
    //         .graph(d3.selectAll('container-1 #graph'))
    //         .eventId('uniqueId1')  // namespace for scroll and resize events
    //         .sections(d3.selectAll('.container-1 #sections > div'))
    //         .offset(innerWidth < 900 ? innerHeight - 30 : 200)
    //
    // });

    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)