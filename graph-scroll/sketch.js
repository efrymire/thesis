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

    var svg = d3.select('.container-1').html('')
        .append('svg')
        .attrs({width: width_full, height: height})
        .attr('style','padding-left: 15px')
        .attr('style','padding-right: 15px')

    // this is only global because of the next graph
    var colors = ['orange', 'purple', 'steelblue', 'pink'];

    var parseDate = d3.timeFormat("%m-%d-%Y");

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
                .range([0, height])
                .domain([1000, d3.max(dataset, function(d) { return d.count; })]);

        var rect = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height - (y(d.count)) })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return y(d.count) })
            .attr('date', function(d) { return (d.date) })
            .attr('count', function(d) { return (d.count) })
            .style('fill','steelblue')
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        // var text = svg.selectAll('rect')
        //     .append('text')
        //     .text(function(d) { return d.count; })
        //     .style('fill','black')
        //     .attr('x', function(d) { return x(d.date) })
        //     .attr('y', function(d) { return height - (y(d.count)) })
        //     .attr('transform', function(d, i) { return 'translate(10, ' + (window.innerHeight-y(d.count)) + ')rotate(-90)'; });


        var div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover() {
            d3.select(this).style('fill','darkblue')
            div.style('display', 'inline');
        }

        function mousemove() {
            div
                .text('date:' + parseDate(d3.select(this).attr('date')) + ', tweets:' + d3.select(this).attr('count'))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 25) + "px");
        }

        function mouseout() {
            d3.select(this).style('fill','steelblue')
            div.style("display", "none");
        }


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

    d3.csv('tweets', function(data) {
        var dataset = data;
        console.log(dataset)

        dataset.forEach(function(d) {
            d.cluster = parseInt(d.cluster)
            // d.time = Date.parse(d.date + 'T' + d.time);
            d.date = Date.parse(d.date);
            // d.hour = parseInt(d.hour)
            // d.minute = parseInt(d.minute)
            // d.second = parseInt(d.second)
            d.likes = parseInt(d.likes);
            d.retweets = parseInt(d.retweets);
            d.replies = parseInt(d.replies);
            d.count = parseInt(d.count);
        })

        console.log(d3.max(dataset, function(d) { return d.likes}))

        var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(dataset.map(function(d) { return d.date; })),
            y = d3.scaleLog()
                .range([0, height_full])
                .domain([1000, d3.max(dataset, function(d) { return d.count; })]);
            l = d3.scaleLinear()
                .range([1,10])
                .domain([0, d3.max(dataset, function(d) { return d.likes; })]);
            // t = d3.scaleLinear()
            //     .range([0, height])
            //     .domain([0, 24])


        var tweet = svg2.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('r', function(d) { return l(d.likes)})
            // .attr('cx', function(d) { return x(d.date)})
            // .attr('cy', function(d) { return (Math.random() * height2)})
            // .attr('cy', function(d) { return (height_full - (Math.random() * y(d.count)))})
            // .attr('cy', function(d) { return (height2 - )})
            .attr('date', function(d) { return (d.date) })
            .attr('likes', function(d) { return (d.likes) })
            .attr('text', function(d) { return (d.text) })
            .style('opacity',0.7)
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        var div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover() {
            d3.select(this).style('fill','darkblue');
            div.style('display', 'inline');
        }

        function mousemove() {
            div
                .text('date:' + parseDate(d3.select(this).attr('date')) + ', likes:' + d3.select(this).attr('likes') + ', tweet text:' + d3.select(this).attr('text'))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 25) + "px");
        }

        function mouseout() {
            d3.select(this).style('fill','steelblue')
            div.style("display", "none");
        }

        // scroll activity

        var gs2;
        gs2 = d3.graphScroll()
            .container(d3.select('.container-2'))
            .graph(d3.selectAll('.container-2 #graph'))
            .eventId('uniqueId2')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-2 #sections > div'))
            .on('active', function (i) {
                var ypos = [
                    function(d) { return (height_full - (Math.random() * y(d.count)))},
                    function(d) { return (Math.random() * height_full)},
                    function(d) { if (d.cluster == 1 ) { return 100 } else { if (d.cluster == 2 ) { return 200 } else { if (d.cluster == 3 ) { return 300 }  else { 400 } } } },
                    // function(d) { if (d.likes > 200 ) {return 100} else {500}},
                    // function(d) { return (Math.random() * height2)},
                    // if (function (d) { return d.likes > 200 } ) { height/3 } else { height/4 };
                ];

                var xpos = [
                    function(d) { return x(d.date)},
                    function(d) { return (Math.random() * width)},
                    // function(d) { if (d.likes > 200 ) {return 100} else {500}},
                    // function(d) { if (d.likes > 200 ) {return 100} else {500}},
                    function(d) { return (Math.random() * width)},
                    // if (function (d) { return d.likes > 200 } ) { height/3 } else { height/4 };
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