// instantiate the scrollama
const scroller = scrollama();

// setup the instance, pass callback functions
scroller
    .setup({
        step: '.scroll__text .step', // required
        container: '.scroll', // required (for sticky)
        graphic: '.scroll__graphic', // required (for sticky)
        offset: 0.5, // optional, default = 0.5
        debug: false // optional, default = false
    })
    .onStepEnter(handleStepEnter)
    .onStepExit(handleStepExit)
    .onContainerEnter(handleContainerEnter)
    .onContainerExit(handleContainerExit);
    
