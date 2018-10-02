/* ---------------- Set Constantas and Global Variables ---------------- */ 

const Constants = {
  ID: "ID",
  ADDRESSABILITY: "ADDRESSABILITY",
  AUDIENCE: "AUDIENCE",
}
const { ID, ADDRESSABILITY, AUDIENCE, AUTOMOBILE, } = Constants

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
    .range([0, w])
    .padding(0.1)
    .domain(dateData.map(d => d.date));

  const date_yScale = d3.scaleLog()
    .range([0, barChartHeight])
    .domain([barChartWidth, d3.max(dateData, d => d.count)])

  // working static

  const barChartDiv = body.select('div.container-1')

  barChart = barChartDiv
    .append('svg')
    .style('width', barChartWidth + 'px')
    .style('height', barChartHeight + 'px')

  barChart.selectAll('rect')
    .data(dateData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => date_xScale(d.date))
    .attr('y', barChartHeight)
    .attr('width', date_xScale.bandwidth())
    .attr('height', d => date_yScale(d.count))
    .style('fill', 'rgb(37,165,242')
    .transition()
      .delay((d,i) => i*10 + barChartWidth)
      .attr('y', d => barChartHeight - date_yScale(d.count))

  var xAxis = d3.axisBottom(date_xScale)

  barChart.append("g")
    .attr("class", "xaxis")
    .attr('transform','translate(20,' + (barChartHeight) + ')')
    .call(xAxis)



  // enter/exit

  // let barChart = barChartDiv
  //   .data([null])

  // barChart = barChart
  //   .enter()
  //   .append('svg')
  //   .merge(barChart)
  //   .style('width', 1000 + 'px')
  //   .style('height', 100 + 'px')

  // let bars = barChart

  // let bar = barChartDiv
  //   .selectAll('rect')
  //   .data(dateData)

  // const barEnter = bar
  //   .enter()
  //   .append('div')
  //   .attr('class', 'bar')

  // bar.exit().remove()
  // bar = barEnter
  //   .merge(bar)





}


