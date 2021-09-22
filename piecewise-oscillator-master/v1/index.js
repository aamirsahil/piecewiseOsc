/*********************************************************/
// Variables

var oscillator, schematic, graph, equation;
var currentIndex = 0, previousCurrentIndex = null;
var simulationRunning = false;
var startTime = 0, runningTime = 0, pauseTime = 0;
var timer = d3.timer(callback);
var bodyId = document.body.id;
/*********************************************************/
// Setup

function setup(){

    oscillator = new Oscillator();
    oscillator.compute(bodyId);

    setupSliders(oscillator);
    createEventListeners();

    schematic = new Schematic(oscillator);
    graph = new Graph(oscillator);
    equation = new Equation(oscillator);
////////////////////////////////////////////////////////down
    if(bodyId == "numerical"){
        table = new Table(oscillator);
        step = new StepCalculator(oscillator);}
//////////////////////////////////////////////////////////up

    $('#play_btn').on('click', function(){
        if(simulationRunning == false){ $("body").trigger({ type: "startTimer" }); }
        else{ $("body").trigger({ type: "resetTimer" }); }
    })
/////////////////////////////////////////////////////////////down
    $("#next_btn").click(function(){
        table.addRow();
        step.addStep();
        graph.simulateNext();
        schematic.simulateNext();
    });
    $("#prev_btn").click(function(){
        table.removeRow();
        step.removeStep();
        graph.simulatePrev();
        schematic.simulatePrev();
    });
//////////////////////////////////////////////////////////////up
}

/*********************************************************/
// Update

function update(){
    oscillator.compute(bodyId);
    schematic.update();
    graph.update();
    equation.update();
    table.update();
    step.update();
    graph.checkIndex();
    schematic.checkIndex();
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
    d3.selectAll('.yaxis_dropdown').classed('active', false);
    d3.select('#yaxis_dropdown_'+param).classed('active', true);
    graph.update();
}

function change_xAxis(param, label){
    graph.xaxis_param = param;
    graph.xaxis_label = label;
    d3.selectAll('.xaxis_dropdown').classed('active', false);
    d3.select('#xaxis_dropdown_'+param).classed('active', true);
    graph.update();
}

function change_timeSpan(span){
    $('body').trigger({ type: "resetTimer" });
    oscillator.timeSpan = span;
    d3.selectAll('.time_dropdown').classed('active', false);
    d3.select('#time_dropdown_'+span).classed('active', true);
    update();
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