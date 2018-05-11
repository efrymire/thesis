new TypeIt('.type-it', { speed: 100,
    strings: ['#metoo.' , 'An exploration of tweets using cluster analysis.'],
    cursor: false
})


var oldWidth = 0
function render(){
    if (oldWidth == innerWidth) return
    oldWidth = innerWidth

    var width = d3.select('#graph1').node().offsetWidth,
        height = d3.select('#graph1').node().offsetWidth,
        height_small = 120;

    var width_full = d3.select('#graph0').node().offsetWidth - 30
    var height_full = window.innerHeight - 40

    // if (innerWidth <= 1200){
    //     width = innerWidth
    //     height = innerHeight*.7
    // }

    // ------- SVG --------

    // set svg and global var
    var axisHeight = 30;

    var svg = d3.select('#graph0').html('')
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

        console.log(dataset)

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
            // .attr('transform','translate(0,' + (height_small - axisHeight) + ')')
            // .orient("bottom");

        svg.append("g")
            .attr("class", "xaxis")
            .attr('transform','translate(20,' + (height_small - axisHeight) + ')')
            .call(xAxis)

    });

    // SVG CLUSTERS ------

    var cluster_height = 400

    var svg_clusters = d3.select('#graph_clusters').html('')
        .append('svg')
        .attr('width', d3.select('#graph_clusters').node().offsetWidth)
        .attr('height', cluster_height)

    // var svg_clusters_tip = d3.select('#graph_clusters_tip').html('')
    //     .append('svg')
    //     .attr('width', d3.select('#graph_clusters_tip').node().offsetWidth)
    //     .attr('height', cluster_height)

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
            // .attr('transform', function() {
            //     if (width > 500) { return 'translate(' + parseInt( width/2 - 250 ) + ',0)' }
            //     else { return 'translate(0,0)' }
            // })

        var cluster_group = svg_clusters.select('#group')
            .selectAll('g')
            .data(data)
            .enter()
            .append('g')

        // Cluster Cirle
        cluster_group.append('circle')
            .attr('cluster', function(d) { return d.cluster})
            .attr('class', 'cluster')
            .attr('cx', function(d) { return (d.cluster % 25) * (width/25) + 10 })
            .attr('cy', function(d) { return parseInt(Math.floor(d.cluster / 25) * (cluster_height/19) + 20) })
            .attr('r', function(d) { return r(d.count) })
            .style('fill', 'steelblue')
            .style('fill-opacity', function(d) { return o(d.count) })

        cluster_group.append('rect')
            .attr('x', function(d) { return (d.cluster % 25) * (width/25) })
            .attr('y', function(d) { return parseInt(Math.floor(d.cluster / 25) * (cluster_height/19) + 10 ) })
            .attr('width', 25)
            .attr('height',20)
            .style('fill','white')
            .style('opacity', 0)
            .style('stroke','black')
            .style('stroke-width','1px')
            .on('mouseover', function() {
                d3.select(this.parentNode).selectAll('.cluster').style('fill','darkgrey')
                d3.select(this.parentNode).selectAll('.cluster_tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this.parentNode).selectAll('.cluster').style('fill','steelblue')
                d3.select(this.parentNode).selectAll('.cluster_tip').style('visibility','hidden')
            })

        // Cluster tooltip - name
        cluster_group.append('text')
            .attr('class', 'cluster_tip')
            .text( function(d) { return 'cluster number: ' + d.cluster })
            .attr('transform', function() { return 'translate(' + parseInt(width + 10) + ',' + 15 + ')'} );

        // Cluster tooltip - count
        cluster_group.append('text')
            .attr('class', 'cluster_tip')
            .text( function(d) { return 'count of tweets: ' + d.count})
            .attr('transform', function() { return 'translate(' + parseInt(width + 10) + ',' + 50 + ')'} );

        // Cluster tooltip - words
        // cluster_group.append('text')
        //     .attr('class', 'cluster_tip')
        //     .text( function(d) { return 'top words: sexual harassment, women, conversation, spark, men, power'})
        //     .attr('transform', function() { return 'translate(' + parseInt(width + 10) + ',' + 85 + ')'} )

        // Cluster tooltip - words
        cluster_group.append('div')
            .style('position','absolute')
            .style('top', 0)
            .style('left', 0)
            .style('width', 100)
            .style('height', 100)
            .style('background-color','black')
            .append('text')
            .attr('class', 'cluster_tip')
            .text( function(d) { return 'top words: sexual harassment, women, conversation, spark, men, power'})
            .attr('transform', function() { return 'translate(' + parseInt(width + 10) + ',' + 85 + ')'} )

    })

    // ------- SVG 1 --------

    var svg1 = d3.select('#graph1').html('')
        .append('svg')
        .attrs({width: width, height: width})

    d3.csv('data/packing', function(error, data) {
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
                d3.select(this.parentNode).selectAll('.node_tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this.parentNode).selectAll('.node').style('fill','steelblue')
                d3.select(this.parentNode).selectAll('.node_tip').style('visibility','hidden')
            })

        var tip = d3.selectAll('.pack').append('text')
            .text(function(d) { return d.data.id })
            .attr('class','node_tip')
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

    d3.json('data/jsonpacking.json', function(error, data) {
        if (error) throw error;

        root = d3.hierarchy(data).sum(function(d) { return d.likes; })

        // ------- circle packing --------

        // Declare d3 layout
        var layout = d3.pack()
            .size([width, height])
            .padding(5)

        // Layout + Data
        var nodes = root.descendants();
        layout(root);

        var node = svg2.selectAll('g')
            .data(nodes)
            .enter()
            .append('g')
            .attr('class','pack')

        var tweet = node.append('circle')
            .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
            .attr('text', function(d) { return 'id: ' + d.data.text})
            .style('fill','white')

        var leaf = d3.selectAll('.leaf')
            .style('fill','steelblue')
            .on('mouseover', function() {
                d3.select(this.parentNode).selectAll('.node').style('fill','darkblue')
                d3.select(this.parentNode).selectAll('.node_tip').style('visibility','visible')
            })
            .on('mouseout', function() {
                d3.select(this.parentNode).selectAll('.node').style('fill','steelblue')
                d3.select(this.parentNode).selectAll('.node_tip').style('visibility','hidden')
            })

        var tip = d3.selectAll('.pack').append('text')
            .text(function(d) { return d.data.text })
            .attr('class','node_tip')
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