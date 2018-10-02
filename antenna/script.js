/* ---------------- Set Constants and Global Variables ---------------- */ 

const Constants = {
  ID: "ID",
  ADDRESSABILITY: "ADDRESSABILITY",
  AUDIENCE: "AUDIENCE",
}
const { ID, ADDRESSABILITY, AUDIENCE, AUTOMOBILE, } = Constants

const parseDate = d3.timeFormat("%m-%d-%Y")

/* ---------------- Default Initial State ---------------- */ 

let state = {
  w: window.innerWidth,
  h: window.innerHeight,
  cluster: 'all',
}

/* ---------------- setState Function ---------------- */ 

function setState(nextState) {
  const prevState = state
  state = Object.assign({}, state, nextState)
  update(prevState)
  // console.log('state update')
}

const body = d3.select('body')

// set new dimensions on resize
d3.select(window).on('resize.', () => setState({
  w: window.innerWidth, 
  h: window.innerHeight,
  cluster: 'all',
}))

/* ---------------- Load Data ---------------- */ 

d3.queue()
  .defer(d3.csv, 'data/date_count.csv')
  .await(function(error, master, drilldown) {

    const dateData = master

    setState({
      dateData
    })

})

/* ---------------- update Function ---------------- */ 

function update(prevState) {
  const { h, w, cluster, dateData} = state

  new TypeIt('.type-it', { speed: 100,
      strings: ['#metoo.' , 'An exploration of tweets using cluster analysis.'],
      // strings: ['What are people really saying about #metoo?'],
      cursor: false
  }) 

  // DATE COUNT BAR CHART 
  
  dateData.map(d => {
    d.date = Date.parse(d.date);
    d.count = parseInt(d.count);
  })

  const barChartWidth = 1000
  const barChartHeight = 100

  // scales

  const date_xScale = d3.scaleBand()
    .range([0, barChartWidth])
    .padding(0.1)
    .domain(dateData.map(d => d.date));

  const date_yScale = d3.scaleLog()
    .range([0, barChartHeight])
    .domain([barChartWidth, d3.max(dateData, d => d.count)])

  // enter/exit

  const barChartSvg = body.select('svg.container-1')

  let barGroup = barChartSvg
    .selectAll('g')
    .data(dateData)

  const barGroupEnter = barGroup.enter()
    .append('g')
    .attr('class', 'barGroup')

  barGroupEnter.append('rect')
    .attr('class', 'bar')
    .attr('x', d => date_xScale(d.date))
    .attr('y', d => barChartHeight - date_yScale(d.count))
    .attr('width', date_xScale.bandwidth())
    .attr('height', d => date_yScale(d.count))
    .style('fill', 'rgb(37,165,242)')

  barGroupEnter.append('text')
    .attr('class', 'bar_tip')
    .text(function(d) { return 'date: ' + parseDate(d.date) + ', tweets: ' + d.count; })
    .attr('transform', function() { return 'translate(' + parseInt( barChartWidth - 2 ) + ',10)'} )

  barGroup = barGroupEnter
    .merge(barGroup)

  barGroupEnter
    .on('mouseover', function() {
      d3.select(this).selectAll('.bar').style('fill-opacity',0.3)
      d3.select(this).selectAll('.bar_tip').style('visibility','visible')
    })
    .on('mouseout', function() {
      d3.select(this).selectAll('.bar').style('fill-opacity',1)
      d3.select(this).selectAll('.bar_tip').style('visibility','hidden')
    })

}


