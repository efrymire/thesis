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
        height_full = window.innerHeight - 40,
        height_small = 150

    if (innerWidth <= 1000){
        width = innerWidth
        height = innerHeight*.7
    }

    // ------- BAR CHART SVG 1 --------

    // set svg and global var

    var axisHeight = 40;

    var svg = d3.select('.container-1').html('')
        .append('svg')
        .attrs({width: width_full, height: height_small})

    var parseDate = d3.timeFormat("%m-%d-%Y");

    // data function

    d3.csv('data/date_count.csv', function(data) {
        var dataset = data;

        dataset.forEach(function(d) {
            d.date = Date.parse(d.date);
            d.count = parseInt(d.count);
        })

        var x = d3.scaleBand()
            .range([0, width_full])
            .padding(0.1)
            .domain(dataset.map(function(d) { return d.date; }));

        var t = d3.scaleBand()
            .domain(["November", "December", "January", "February", "March", "April"])
            .range([0, width_full]);

        var y = d3.scaleLog()
            .range([0, height_small - axisHeight])
            .domain([1000, d3.max(dataset, function(d) { return d.count; })]);

        // G for all bars
        svg.append('g')
            .attr('id', 'group')

        var group = svg.select('#group')
            .selectAll('g')
            .data(dataset)
            .enter()
            .append('g')
            .on('mouseover', function() {
                d3.select(this).selectAll('.bar').style('fill','darkgrey')
                d3.select(this).selectAll('.bar_tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this).selectAll('.bar').style('fill','steelblue')
                d3.select(this).selectAll('.bar_tip').style('visibility','hidden')
            })

        // RECT
        group.append('rect')
            .attr("class", "bar")
            .attr('x', function(d) { return x(d.date) })
            .attr('y', function(d) { return height_small - (y(d.count)) - axisHeight })
            .attr('width', x.bandwidth())
            .attr('height', function(d) { return y(d.count) })
            .attr('date', function(d) { return (d.date) })
            .attr('count', function(d) { return (d.count) })
            .style('fill','steelblue')

        // TIP
        group.append('text')
            .attr('class','bar_tip')
            .text(function(d) { return 'date: ' + parseDate(d.date) + ', tweets: ' + d.count; })
            .attr('transform', function() { return 'translate(' + parseInt( width_full - 2 ) + ',10)'} )

        var xAxis = d3.axisBottom(t)

        svg.append("g")
            .attr("class", "xaxis")
            .attr('transform','translate(20,' + (height_small - axisHeight) + ')')
            .call(xAxis)

        // scroll activity

        var gs = d3.graphScroll()
            .container(d3.select('.container-1'))
            .graph(d3.selectAll('container-1 #graph'))
            .eventId('uniqueId1')  // namespace for scroll and resize events
            .sections(d3.selectAll('.container-1 #sections > div'))
            .offset(innerWidth < 900 ? innerHeight - 30 : 200)

    });

    // ------- GRAPH SCROLL SVG 2 --------

    var colors = ['orange', 'purple', 'steelblue', 'pink'];

    var svg2 = d3.select('.container-2 #graph').html('')
        .append('svg')
        .attrs({width: width, height: height_full})

    var r = Math.min(width, height_full) - 10;

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
            .size([r, r])
            .padding(5)

        // Layout + Data
        var root = d3.hierarchy(stratified).sum(function (d) { return parseInt(d.data.likes + 1); });
        var nodes = root.descendants();
        layout(root);

        var node = svg2.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class','pack');


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

        tweet.attr('r', function(d) { return (d.r)})
            .style('opacity',0.3)


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

    // ------- GRAPH CLUSTERS SVG 3 --------

    // set svg and global var

    var svg3 = d3.select('#graph_clusters').html('')
        .append('svg')
        .attrs({width: width, height: height})
        .attr('style','padding-left: 15px')
        .attr('style','padding-right: 15px')

    // data function
    var cluster_height = 400,
        cluster_width = d3.select('#graph_clusters').node().offsetWidth

    var svg_clusters = d3.select('#graph_clusters').html('')
        .append('svg')
        .attr('width', cluster_width)
        .attr('height', cluster_height)

    d3.csv('data/cluster_count.csv', function(data) {

        data.forEach( function(d) {
            d.cluster = parseInt(d.cluster),
            d.count = parseInt(d.count)
        });

        var r = d3.scaleLog()
            .range([0.2,8])
            .domain([1, d3.max(data, function(d) {return d.count})])

        var o = d3.scaleLog()
            .range([0,1])
            .domain([1, d3.max(data, function(d) {return d.count})])

        // Cluster G
        var g = svg_clusters.append('g')
            .attr('id', 'group')

        var cluster_group = svg_clusters.select('#group')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')

        // Cluster Circle
        cluster_group.append('circle')
            .attr('cluster', function(d) { return d.cluster})
            .attr('class', 'cluster')
            .attr('cx', function(d) { return (d.cluster % 25) * (cluster_width/25) + 10 })
            .attr('cy', function(d) { return parseInt(Math.floor(d.cluster / 25) * (cluster_height/19) + 20) })
            .attr('r', function(d) { return r(d.count) })
            .style('fill', 'steelblue')
            .style('fill-opacity', function(d) { return o(d.count) })

        cluster_group.append('rect')
            .attr('x', function(d) { return (d.cluster % 25) * (cluster_width/25) })
            .attr('y', function(d) { return parseInt(Math.floor(d.cluster / 25) * (cluster_height/19) + 10 ) })
            .attr('width', cluster_width/25)
            .attr('height',20)
            .style('fill','white')
            .style('opacity', 0)
            .style('stroke','black')
            .style('stroke-width','1px')
            .on('mouseover', function(a, b, c, d) {
                d3.select('#graph_clusters_tip').html('cluster: ' + a.cluster + '<br>' + 'count of tweets in cluster: ' + a.count + '<br>' + 'top words in cluster: ' )
                d3.select(this.parentNode).selectAll('.cluster').style('fill','darkgrey')
            })
            .on('mouseout', function() {
                d3.select('#graph_clusters_tip').html('')
                d3.select(this.parentNode).selectAll('.cluster').style('fill','steelblue')
            })

    });

    /// CIRCLE PACK 1

    var svg_pack1 = d3.select('.container-4 #pack1')

    var height_pack1 = svg_pack1.node().getBoundingClientRect().height,
        width_pack1 = svg_pack1.node().getBoundingClientRect().width;

    var r = Math.min(width_pack1, height_pack1) - 10;

    d3.json('data/jsonpacking.json', function(error, data) {
        if (error) throw error;

        root = d3.hierarchy(data).sum(function (d) {
            return d.likes;
        })

        // ------- circle packing --------

        // Declare d3 layout
        var layout = d3.pack()
            .size([r, r])
            .padding(5)

        // Layout + Data
        var nodes = root.descendants();
        layout(root);

        var node = svg_pack1.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'pack')
            .attr('transform', 'translate(' + parseInt(width_pack2 - r) / 2 + ',' + parseInt(height_pack2 - r) / 2 + ')');

        var tweet = node.append('circle')
            .attr("class", function (d) {
                return d.children ? "node" : "leaf node";
            })
            .attr('text', function (d) { return d.data.text })
            .attr('user', function (d) { return d.data.user })
            // .attr('date', function (d) { return d.data.timestamp })


        var leaf = d3.selectAll('.leaf')
            .style('fill', 'steelblue')
            .on('mouseover', function(a) {
                d3.select(this.parentNode).selectAll('.node').style('fill', 'darkblue')
                d3.select('#pack1_tip').html('user: ' + a.data.user + '<br>' +  'tweet text: ' + a.data.text)
            })
            .on('mouseout', function () {
                d3.select(this.parentNode).selectAll('.node').style('fill', 'steelblue')
                d3.select('#pack1_tip').html('')
            })


        // ------- draw circles --------

        tweet.attr('r', function (d) {
            return (d.r)
        })
            .style('opacity', 0.3)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })

    })


    /// CIRCLE PACK 2

    var svg_pack2 = d3.select('.container-5 #pack2')

    var height_pack2 = svg_pack2.node().getBoundingClientRect().height,
        width_pack2 = svg_pack2.node().getBoundingClientRect().width;

    d3.json('data/jsonpacking.json', function(error, data) {
        if (error) throw error;

        root = d3.hierarchy(data).sum(function (d) {
            return d.likes;
        })

        var r = Math.min(width_pack2, height_pack2) - 10

        // ------- circle packing --------

        // Declare d3 layout
        var layout = d3.pack()
            .size([r, r])
            .padding(5)

        // Layout + Data
        var nodes = root.descendants();
        layout(root);

        var node = svg_pack2.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class', 'pack')
            .attr('transform', 'translate(' + parseInt(width_pack2 - r) / 2 + ',' + parseInt(height_pack2 - r) / 2 + ')');

        var tweet = node.append('circle')
            .attr("class", function (d) {
                return d.children ? "node" : "leaf2 node";
            })
            .attr('text', function (d) {
                return 'id: ' + d.data.text
            })
            .style('fill', 'white')

        var leaf2 = d3.selectAll('.leaf2')
            .style('fill', 'steelblue')
            .on('mouseover', function (a) {
                d3.select(this.parentNode).selectAll('.node').style('fill', 'darkblue')
                d3.select('#pack2_tip').html('user: ' + a.data.user + '<br>' +  'tweet text: ' + a.data.text)
            })
            .on('mouseout', function () {
                d3.select(this.parentNode).selectAll('.node').style('fill', 'steelblue')
                d3.select('#pack2_tip').html('')
            })

        var tip = d3.selectAll('.pack').append('text')
            .text(function (d) {
                return d.data.text
            })
            .attr('class', 'node_tip')
            .style('alignment-baseline', 'hanging')
            .style('visibility', 'hidden')
            .attr('transform', 'translate(0,10)')


        // ------- draw circles --------

        tweet.attr('r', function (d) {
            return (d.r)
        })
            .style('opacity', 0.3)
            .attr('cx', function (d) {
                return d.x;
            })
            .attr('cy', function (d) {
                return d.y;
            })

    })


    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)