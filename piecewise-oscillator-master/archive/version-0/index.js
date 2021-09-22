/*********************************************************/
// Variables

var oscillator, schematic, graph;
var currentIndex = 0, previousCurrentIndex = null;
var simulationRunning = false;
var startTime = 0, runningTime = 0, pauseTime = 0;
var timer = d3.timer(callback);

/*********************************************************/
// Setup

function setup(){
    oscillator = new Oscillator();
    oscillator.compute();

    setupSliders(oscillator);
    createEventListeners();

    schematic = new Schematic(oscillator);
    graph = new Graph(oscillator);

    $('#play_btn').on('click', function(){
        if(simulationRunning == false){ $("body").trigger({ type: "startTimer" }); }
        else{ $("body").trigger({ type: "resetTimer" }); }
    })
    
}

/*********************************************************/
// Update

function update(){
    oscillator.compute();
    schematic.update();
    graph.update();
}

/*********************************************************/
// Simulate

function simulate_start(){
    schematic.simulate_start();
}

function simulate(){
    schematic.simulate();
    graph.simulate();
}

function simulate_end(){
    schematic.simulate_end();
    graph.update();
}

/*********************************************************/
// Event Listeners

function createEventListeners(){
    $('body').on('param_change', function(d){
        $('body').trigger({ type: "resetTimer" });
        oscillator[d.param].value = parseFloat(d.value);
        update();
    })

    $('body').on('startTimer', function(){
        startTimer(); 
        $('#play_btn').text('Stop'); 
    })

    $('body').on('resetTimer', function(){
        resetTimer(); 
        $('#play_btn').text('Play'); 
    })
}

function change_yAxis(param, label){
    graph.yaxis_param = param;
    graph.yaxis_label = label;
    graph.update();
}

function change_xAxis(param, label){
    graph.xaxis_param = param;
    graph.xaxis_label = label;
    graph.update();
}

/*********************************************************/
// Timer functions

function startTimer(){
	simulationRunning = true;
	startTime = Date.now();
	if(currentIndex == 0){ simulate_start(); }
	timer.restart(callback);
}

function resetTimer(){
	simulationRunning = false;
	pauseTime = 0; runningTime = 0;
	currentIndex = 0; previousCurrentIndex = null;
	simulate_end();
	timer.stop();
}

function callback(){
	if(simulationRunning){
		runningTime = pauseTime + (Date.now() - startTime)/1000;
		if(runningTime >= oscillator.timeSpan){ $("body").trigger({ type: "resetTimer" }); return }
		currentIndex = parseInt((runningTime/dt).toFixed(0));
		if(currentIndex != previousCurrentIndex && currentIndex % 1 == 0){ simulate(); previousCurrentIndex = currentIndex; }
	}
}

/*********************************************************/
// Run

setup();