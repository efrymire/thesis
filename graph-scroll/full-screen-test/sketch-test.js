
var oldWidth = 0
function render(){
    if (oldWidth == innerWidth) return
    oldWidth = innerWidth

    var width = d3.select('#graph').node().offsetWidth,
        height = d3.select('#graph').node().offsetHeight;

    var // width_full = d3.select('.container-1').node().offsetWidth,
        height_full = window.innerHeight

    if (innerWidth <= 1200){
        width = innerWidth
        height = innerHeight*.7
    }


    var colors = ['orange', 'purple', 'steelblue', 'pink'];


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

        console.log(nodes)
        console.log(tweet)



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


    d3.select('#source')
        .styles({'margin-bottom': window.innerHeight - 450 + 'px', padding: '100px'})
}
render()
d3.select(window).on('resize', render)