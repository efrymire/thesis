new TypeIt('.type-it', { speed: 100,
    strings: ['#metoo.' , 'An exploration of tweets using cluster analysis.'],
    cursor: false
})


var oldWidth = 0
function render(){
    if (oldWidth == innerWidth) return
    oldWidth = innerWidth

    var width = d3.select('#graph1').node().offsetWidth,
        height = d3.select('#graph1').node().offsetWidth;

    var width_full = d3.select('#graph0').node().offsetWidth - 30
    var height_full = window.innerHeight - 40

    // if (innerWidth <= 1200){
    //     width = innerWidth
    //     height = innerHeight*.7
    // }

    // ------- SVG --------

    // set svg and global var

    var axisHeight = 40;

    var svg = d3.select('#graph0').html('')
        .append('svg')
        .attrs({width: width_full, height: height})
    // .attr('style','padding-left: 15px')
    // .attr('style','padding-right: 15px')

    // this is only global because of the next graph
    var colors = ['orange', 'purple', 'steelblue', 'pink'];

    var parseDate = d3.timeFormat("%m-%d-%Y");
    var axisDate = d3.timeFormat('%B')

    // data function

    d3.csv('graph-scroll/date_count.csv', function(data) {
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
            .style('fill','steelblue')
            .style('visibility','hidden')
            .style('alignment-baseline', 'hanging')
            // .style('font-style','italic')
            // .style('font-size','12')
            // .attr('transform',function(d) { return 'translate(' + parseInt( x(d.date)) + ', ' + (height - axisHeight - y(d.count) - 5) + ')rotate(-90)'; })
            .attr('transform', function() { return 'translate(' + parseInt( width_full - 2 ) + ',10)'} )
            .style('text-anchor','end')
            .style('font-size','1rem')


    });

    // ------- SVG 1 --------

    var svg1 = d3.select('#graph1').html('')
        .append('svg')
        .attrs({width: width, height: width})

    d3.csv('packing', function(error, data) {
        if (error) throw error;
        stratified = d3.stratify()(data);
        console.log(stratified)

        data.forEach(function(d) {
            d.parentId = parseInt(d.parentId)
            d.likes = parseInt(d.likes);
        })


        // ------- circle packing --------

        // Declare d3 layout
        var layout = d3.pack()
            .size([width, height])
            .padding(5)

        // Layout + Data
        var root = d3.hierarchy(stratified).sum(function (d) { return parseInt(d.data.likes + 1); });
        var nodes = root.descendants();
        layout(root);

        var node = svg1.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class','pack')

        var tweet = node.append('circle')
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr('id', function(d) { return 'id: ' + d.data.id})
            .style('fill','white')

        var leaf = d3.selectAll('.leaf')
            .style('fill','steelblue')
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


        // ------- draw circles --------

        tweet.attr('r', function(d) { return (d.r)})
            .style('opacity',0.3)
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })

    });

    // SVG 2

    var svg2 = d3.select('#graph2').html('')
        .append('svg')
        .attrs({width: width, height: width})

    d3.csv('packing', function(error, data) {
        if (error) throw error;
        stratified = d3.stratify()(data);
        console.log(stratified)

        data.forEach(function(d) {
            d.parentId = parseInt(d.parentId)
            d.likes = parseInt(d.likes);
        })


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

        var tweet = node.append('circle')
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr('id', function(d) { return 'id: ' + d.data.id})
            .style('fill','white')

        var leaf = d3.selectAll('.leaf')
            .style('fill','steelblue')
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


        // ------- draw circles --------

        tweet.attr('r', function(d) { return (d.r)})
            .style('opacity',0.3)
            .attr('cx', function (d) { return d.x; })
            .attr('cy', function (d) { return d.y; })

    });

    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)