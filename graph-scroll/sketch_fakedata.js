var oldWidth = 0
function render(){
    if (oldWidth == innerWidth) return
    oldWidth = innerWidth

    var width = d3.select('#graph').node().offsetWidth,
        height = d3.select('#graph').node().offsetWidth;


    if (innerWidth <= 925){
        width = innerWidth
        height = innerHeight*.7
    }

    // ------- SVG --------

    // set svg and global var

    var svg = d3.select('#graph').html('')
        .append('svg')
        .attrs({width: width, height: height})

    // this is only global because of the next graph
    var colors = ['orange', 'purple', 'steelblue', 'pink'];

    // data function

    d3.csv('test-data.csv', function(data) {
        var dataset = data;

        dataset.forEach(function(d) {
            d.date = Date.parse(d.date);
            d.tweets = parseInt(d.tweets);
            d.pos = parseInt(d.pos);
            d.neg = parseInt(d.neg);
        })

        var x = d3.scaleBand()
                .range([0, width])
                .padding(0.1)
                .domain(dataset.map(function(d) { return d.date; })),
            y = d3.scaleLinear()
                .range([0, height/2])
                .domain([0, d3.max(dataset, function(d) { return d.tweets; })]);

        var rect = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr("class", "bar")
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height/2 - (y(d.tweets)) })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return y(d.tweets) })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        var text = svg.selectAll('rect')
            .append('text')
            .text(function(d) { return d.tweets; })
            .style('fill','black')
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height - (y(d.tweets)) })
            .attr('transform', function(d, i) { return 'translate(10, ' + (window.innerHeight-y(d.tweets)) + ')rotate(-90)'; });


        var div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover() {
            div.style('display', 'inline');
        }

        function mousemove() {
            div
                .text("text")
                .style("left", (d3.event.pageX - 34) + "px")
                .style("top", (d3.event.pageY - 12) + "px");
        }

        function mouseout() {
            div.style("display", "none");
        }


        // scroll activity

        var gs = d3.graphScroll()
            .container(d3.select('.container-1'))
            .graph(d3.selectAll('container-1 #graph'))
            .eventId('uniqueId1')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-1 #sections > div'))
            // .offset(innerWidth < 900 ? innerHeight - 30 : 200)
            .on('active', function(i){

                var ypos = [
                    function(d) { return height/2 - (y(d.tweets)) },
                    function(d) { return height/2 - (y(d.pos)) },
                    function(d) { return height - x(d.date) },
                    height/2
                ];

                var xpos = [
                    function(d) { return x(d.date) },
                    function(d) { return x(d.date) },
                    function(d) { return width/2 - (y(d.pos)) },
                    0
                ];

                var wid = [
                    x.bandwidth(),
                    x.bandwidth(),
                    function(d) { return y(d.tweets) },
                    width
                ];

                var hgt = [
                    function(d) { return y(d.tweets) },
                    function(d) { return y(d.tweets) },
                    x.bandwidth(),
                    10
                ];

                rect.transition().duration(600)
                    .attr('y', ypos[i] )
                    .attr('x', xpos[i] )
                    .attr('width', wid[i] )
                    .attr('height', hgt[i] )
                    .transition()
                    .style('fill', colors[i]);

            })

    });

    // ------- SVG 2 --------

    // var svg2 = d3.select('.container-2 #graph').html('')
    //     .append('svg')
    //     .attrs({width: width, height: height})

    // var path = svg2.append('path')

    // ------- SCROLL 2 --------

    // var gs2 = d3.graphScroll()
    //     .container(d3.select('.container-2'))
    //     .graph(d3.selectAll('.container-2 #graph'))
    //     .eventId('uniqueId2')  // namespace for scroll and resize events
    //     .sections(d3.selectAll('.container-2 #sections > div'))
    //     .on('active', function(i){
    //         var h = height
    //         var w = width
    //         var dArray = [
    //             [[w/4, h/4], [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
    //             [[0, 0],     [w*3/4, h/4],  [w*3/4, h*3/4], [w/4, h*3/4]],
    //             [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
    //             [[w/2, h/2], [w, h/4],      [w, h],         [w/4, h]],
    //             [[w/2, h/2], [w, h/2],      [0, 0],         [w/4, h/2]],
    //             [[w/2, h/2], [0, h/4],      [0, h/2],         [w/4, 0]],
    //         ].map(function(d){ return 'M' + d.join(' L ') })


    //         path.transition().duration(1000)
    //             .attr('d', dArray[i])
    //             .style('fill', colors[i])
        // })

    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)