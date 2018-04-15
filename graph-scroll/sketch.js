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

    var parseDate = d3.timeFormat("%m-%d-%Y");

    // data function

    d3.csv('date_count', function(data) {
        var dataset = data;

        dataset.forEach(function(d) {
            d.date = Date.parse(d.date);
            d.count = parseInt(d.count);
        })

        var x = d3.scaleBand()
                .range([0, width])
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
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout);

        var text = svg.selectAll('rect')
            .append('text')
            .text(function(d) { return d.count; })
            .style('fill','black')
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height - (y(d.count)) })
            .attr('transform', function(d, i) { return 'translate(10, ' + (window.innerHeight-y(d.count)) + ')rotate(-90)'; });


        var div = d3.select('body').append('div')
            .attr('class', 'tooltip')
            .style('display', 'none');

        function mouseover() {
            div.style('display', 'inline');
        }

        function mousemove() {
            div
                .text('date:' + parseDate(d3.select(this).attr('date')) + ', tweets:' + d3.select(this).attr('count'))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 25) + "px");
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
            .offset(innerWidth < 900 ? innerHeight - 30 : 200)

    });

    // ------- SVG 2 --------

    var svg2 = d3.select('.container-2 #graph').html('')
        .append('svg')
        .attrs({width: width, height: height})

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


        var tweet = svg2.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('r', function(d) { return l(d.likes)})
            .attr('cx', function(d) { return x(d.date)})
            // .attr('cy', function(d) { return height - (y(d.count)) })
            .attr('cy', function() { return Math.random() * height })
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
                .text('date:' + parseDate(d3.select(this).attr('date')) + ', likes:' + d3.select(this).attr('likes') + ', tweet text:' + d3.select(this).attr('text'))
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 25) + "px");
        }

        function mouseout() {
            d3.select(this).style('fill','steelblue')
            div.style("display", "none");
        }

        var gs2 = d3.graphScroll()
            .container(d3.select('.container-2'))
            .graph(d3.selectAll('.container-2 #graph'))
            .eventId('uniqueId2')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-2 #sections > div'))
            .on('active', function(i){
                var ypos = [
                    function() { return Math.random() * height },
                    function() { return Math.random() * height },
                    function(d) { return height - (y(d.count)) },
                    function(d) { return height - (y(d.count)) }
                ];

                tweet.transition().duration(1000)
                    .attr('cy', ypos[i])
                    .style('fill', colors[i])
            })

    });

    // ------- SCROLL 2 --------

    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)