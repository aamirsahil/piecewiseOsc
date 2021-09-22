// function createGraph_plotly(oscillator){
//     var data = {
//       x: oscillator.system_States.map(d => { return d[x_axis] }),
//       y: oscillator.system_States.map(d => { return d[y_axis] }),
//       type: 'lines',
//     }
  
//     var layout = {
//       title:'Oscillations (ζ = ' +oscillator.zeta.toFixed(2)+ ', ω<span style="dominant-baseline: mathematical;">n</span> = ' +oscillator.omega_Natural.toFixed(2)+ ')',
//       xaxis: { title: x_axis_label + ' →' },
//       yaxis: { title: y_axis_label + ' →' },
//     };
  
//     Plotly.newPlot('chart', [data], layout);
//     var symbol = $('#chart .modebar-group');
//     $(symbol[ symbol.length-1 ]).css({ "visibility": "hidden" });
// }

/*************************************************************************/

function Graph(oscillator){
    this.oscillator = oscillator;
    this.width = parseInt(d3.select('#graph').style('width'));
    this.height = parseInt(d3.select('#graph').style('height'));
    this.create();
    this.index = 0;
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
}

/*************************************************************************/

Graph.prototype.create = function(){
    this.svg = d3.select('#graph');
    this.origin = this.svg.append('g');
    this.xAxis = this.origin.append('g');
    this.yAxis = this.origin.append('g');
    this.stroke = this.origin.append('path');
    this.xLabel = this.svg.append('text');
    this.yLabel = this.svg.append('text');
  
    this.point = this.origin.append('circle');
  
    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.lineGen = d3.line();

    this.xaxis_param = 'time';
    this.yaxis_param = 'disp';
    this.xaxis_label = 'Time';
    this.yaxis_label = 'Displacement';

    this.setup();
}

/*************************************************************************/

Graph.prototype.setup = function(){
    // this.xAxis.styles({ 'stroke': 'gray', 'stroke-width': 1 });
    // this.yAxis.styles({ 'stroke': 'gray', 'stroke-width': 1 });
    this.stroke.styles({ 'stroke': 'steelblue', 'stroke-width': 1, 'fill': 'none' });
    this.point.styles({ 'stroke': 'red', 'stroke-width': 2, 'fill': 'white' }).attrs({ r: 3 });
    this.update();
}

/*************************************************************************/

Graph.prototype.update = function(){
    var x_array = this.oscillator.system_States.map(d => { return d[this.xaxis_param] });
    var y_array = this.oscillator.system_States.map(d => { return d[this.yaxis_param] });
  
    if(this.xaxis_param == 'time'){
      this.origin.attrs({ 'transform': 'translate(' +0.05*this.width+ ',' +0.5*this.height+ ')' });
      this.xScale.range([0, 0.9*this.width]).domain([0, this.oscillator.timeSpan]);
    }
    else {
      this.origin.attrs({ 'transform': 'translate(' +0.5*this.width+ ',' +0.5*this.height+ ')' });
      temp_x = math.max(math.abs( x_array ));
      this.xScale.domain([-temp_x, temp_x]).range([-0.45*this.width, 0.45*this.width]);
    }
  
    temp_y = math.max(math.abs( y_array ));
    this.yScale.domain([-temp_y, temp_y]).range([0.45*this.height, -0.45*this.height]);
  
    this.point_array = [];
    this.point_array = x_array.map((d, i) => { return [ this.xScale(x_array[i]), this.yScale(y_array[i]), i ] });
  
    // console.log(this.point_array);
  
    this.stroke.attrs({ d: this.lineGen(this.point_array) });

    d3.selectAll('.points').remove();
    this.origin.selectAll('.points')
        .data(this.point_array).enter().append('circle')
        .attrs({ 'cx': d => d[0], 'cy': d => d[1], 'r': 3, 'class': 'points', 'id': d => 'points_'+d[2] })
        .styles({ 'fill': 'red' });
  
    this.xAxis.call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale));
  
    this.xLabel.attrs({ x: 0.5*this.width, y: 0.98*this.height }).text(this.xaxis_label + ' →');
    this.yLabel.attrs({ transform: 'translate(' +0.02*this.width+ ',' +0.5*this.height+ ') rotate(-90)' }).text(this.yaxis_label + ' →');
  
    this.simulate();
}

/*************************************************************************/

Graph.prototype.simulate = function(){
  if(simulationRunning){ 
      this.stroke.attrs({ d: this.lineGen(this.point_array.slice(0,currentIndex+1)) });
      d3.selectAll('.points').styles({ 'display': 'none' });
      d3.range(currentIndex+1).forEach(i => { d3.select('#points_'+i).styles({ 'display': null }) });
    }  

  this.point.attrs({ cx: this.point_array[currentIndex][0], cy: this.point_array[currentIndex][1] });
  let temp = parseInt(10*100*currentIndex/this.oscillator.system_States.length)/10;
  d3.select('#progress-bar').styles({ width: temp+"%" });
}

//Incrementing Graph
Graph.prototype.simulateNext = function(){
    if(this.index<(this.maxIndex)){
        this.index++;
        this.stroke.attrs({ d: this.lineGen(this.point_array.slice(0,this.index+1)) });
        d3.selectAll('.points').styles({ 'display': 'none' });
        d3.range(this.index+1).forEach(i => { d3.select('#points_'+i).styles({ 'display': null }) });
        this.point.attrs({ cx: this.point_array[this.index][0], cy: this.point_array[this.index][1] });
        let temp = parseInt(10*100*(this.index+1)/this.oscillator.system_States.length)/10;
        d3.select('#progress-bar').styles({ width: temp+"%" });
    }
}
Graph.prototype.simulatePrev = function(){
    if(this.index>0){
        this.index--;
        this.stroke.attrs({ d: this.lineGen(this.point_array.slice(0,this.index+1)) });
        d3.selectAll('.points').styles({ 'display': 'none' });
        d3.range(this.index+1).forEach(i => { d3.select('#points_'+i).styles({ 'display': null }) });
        this.point.attrs({ cx: this.point_array[this.index][0], cy: this.point_array[this.index][1] });
        let temp = parseInt(10*100*this.index/this.oscillator.system_States.length)/10;
        d3.select('#progress-bar').styles({ width: temp+"%" });
    }
}

Graph.prototype.checkIndex = function(){
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.index = 0;
}

/*************************************************************************/

// function createGraph_variableStroke(oscillator){
//     this.oscillator = oscillator;
//     this.width = d3.select('#canvas').style('width');
//     this.height = d3.select('#canvas').style('height');
  
//     this.canvas = document.getElementById('canvas');
//     this.ctx = canvas.getContext('2d');
//     this.xScale = d3.scaleLinear();
//     this.yScale = d3.scaleLinear();
  
// }

/*************************************************************************/

// createGraph_variableStroke.prototype.update = function(){
//     if(x_axis == 'time'){
//       this.xData = this.oscillator.system_States.map(d => { return d[x_axis] });
//       this.xScale.domain([0, timeSpan.value]).range([0.1*this.width, 0.9*this.width]);
  
//       this.yData = this.oscillator.system_States.map(d => { return d[y_axis] });
//       var temp_max = math.max(math.abs(this.yData));
//       this.yScale.domain([temp_max, -temp_max]).range([0.1*this.height, 0.9*this.height]);
//     }
//     else{
//       this.xData = this.oscillator.system_States.map(d => { return d[x_axis] });
//       var temp_max = math.max(math.abs(this.xData));
//       this.xScale.domain([-temp_max, temp_max]).range([0.1*this.width, 0.9*this.width]);
  
//       this.yData = this.oscillator.system_States.map(d => { return d[y_axis] });
//       var temp_max = math.max(math.abs(this.yData));
//       this.yScale.domain([temp_max, -temp_max]).range([0.1*this.height, 0.9*this.height]);
//     }
    
// }
  