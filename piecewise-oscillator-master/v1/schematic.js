function Schematic(object){
    this.oscillator = object;
    this.distance_scale = d3.scaleLinear();
    this.lineGenerator = d3.line().x(function(d){ return d.x }).y(function(d){ return d.y });
    this.index = 0;
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);

    this.svg = d3.select('#schematic');
    this.width = parseInt(this.svg.style('width'))/innerWidth;
    this.height = parseInt(this.svg.style('height'))/innerHeight;
  
    var defs = this.svg.append("defs");
    defs.append("marker").attrs({ id: "arrow", viewBox: "0 -5 10 10", refX: 5, refY: 0, markerWidth: 4, markerHeight: 4, orient: "auto" })
        .append("path").attrs({ d: 'M 0,-5 L 10,0 L 0,5' }).styles({ "fill": "gray", "stroke": "none" });
  
    this.create();
}

/*********************************************************/
  
Schematic.prototype.create = function(){
    this.origin = this.svg.append("g");
    this.ground = this.origin.append("line");
    this.left_clamp = this.origin.append("line");
    this.zeroMark = this.origin.append("line");
  
    this.initialPosition_vector = this.origin.append("line");
    this.initialPosition_marker = this.origin.append("text");
    this.initialPosition_marker.append('tspan').attrs({ id: 'text_x' });
    this.initialPosition_marker.append('tspan').attrs({ id: 'text_0' });
  
    this.initialVelocity_vector = this.origin.append("line");
    this.initialVelocity_marker = this.origin.append("text");
    this.initialVelocity_marker.append('tspan').attrs({ id: 'text_v' });
    this.initialVelocity_marker.append('tspan').attrs({ id: 'text_0' });
  
    this.excitingForce_vector = this.origin.append("line");
    this.excitingForce_marker = this.origin.append("text");
    this.excitingForce_marker.append('tspan').attrs({ id: 'text_F' });
    this.excitingForce_marker.append('tspan').attrs({ id: 'text_0' });
    this.excitingForce_marker.append('tspan').attrs({ id: 'text_sin' });
  
    this.block = this.origin.append("rect");
    this.spring_g = this.origin.append("g");
    this.spring_path = this.spring_g.append("path");
    this.damper_g = this.origin.append("g");
    this.damper_path = this.damper_g.append("path");
  
    this.right_clamp = this.origin.append("line");
    this.aux_spring_g = this.origin.append("g");
    this.aux_spring_path = this.aux_spring_g.append("path");
    this.aux_spring_support = this.aux_spring_g.append("line");
    this.setup();
}
  
/*********************************************************/
  
Schematic.prototype.setup = function(){
    this.initialPosition_vector.attrs({ 'marker-end': 'url(#arrow)' });
    this.initialVelocity_vector.attrs({ 'marker-end': 'url(#arrow)' });
    this.excitingForce_vector.attrs({ 'marker-end': 'url(#arrow)' });
    d3.select('#text_x').text('x');
    d3.select('#text_v').text('v');
    d3.select('#text_F').text('F');
    d3.select('#text_sin').text('sin(ωt)');
    d3.selectAll('#text_0').text('o');
    this.resize();
}
  
/*********************************************************/
  
Schematic.prototype.resize = function(){
    this.origin.attrs({ "transform": "translate(" +(0.05*this.width*innerWidth)+ "," +(0.7*this.height*innerHeight)+ ")" })
    // this.ground.styles({ "stroke": "gray", "stroke-width": "0.2vh" }).attrs({ x1: 0, y1: 0, x2: 0.9*this.width*innerWidth, y2: 0 });
    this.left_clamp.styles({ "stroke": "gray", "stroke-width": "0.15vh" }).attrs({ x1: 0, y1: -0.6*this.height*innerHeight, x2: 0, y2: 0 });
  
    // this.distance_scale.domain([-20, 20]).range([0*this.width*innerWidth, 0.9*this.width*innerWidth]);
    this.distance_scale.domain([-1.5*this.oscillator.initialPosition.max, 1.5*this.oscillator.initialPosition.max]).range([0*this.width*innerWidth, 0.9*this.width*innerWidth]);
    this.origin.call(d3.axisBottom(this.distance_scale))
    this.zeroMark.styles({ "stroke": "gray", "stroke-width": "0.2vh" });
  
    this.initialPosition_vector.styles({ "stroke": "gray", "stroke-width": "0.2vh" });
    this.initialPosition_marker.styles({ 'dominant-baseline': 'central', 'text-anchor': 'middle', 'font-size': '1.4em', 'stroke': 'gray', 'fill': 'gray' });
    d3.selectAll("#text_0").styles({ 'baseline-shift': 'sub' });
  
    this.initialVelocity_vector.styles({ "stroke": "gray", "stroke-width": "0.2vh" });
    this.initialVelocity_marker.styles({ 'dominant-baseline': 'central', 'text-anchor': 'middle', 'font-size': '1.4em', 'stroke': 'gray', 'fill': 'gray' });
  
    this.excitingForce_vector.styles({ "stroke": "gray", "stroke-width": "0.2vh" });
    this.excitingForce_marker.styles({ 'dominant-baseline': 'central', 'text-anchor': 'start', 'font-size': '1.4em', 'stroke': 'gray', 'fill': 'gray' });
  
    this.block_width = 0.5*this.height*innerHeight;
    this.block.styles({ "fill": "#CCC", "stroke": "gray", "stroke-width": "0.15vh" }).attrs({ width: this.block_width, height: this.block_width, rx: "2%", ry: "2%" });
  
    this.spring_g.attrs({ "transform": "translate(0," +(-0.33*this.block_width)+ ")" });
    this.spring_path.styles({ "fill": "none", "stroke": "gray", "stroke-width": "0.15vh" });
  
    this.damper_g.attrs({ "transform": "translate(0," +(-0.66*this.block_width)+ ")" });
    this.damper_path.styles({ "fill": "none", "stroke": "gray", "stroke-width": "0.15vh" });
  
    this.right_clamp.styles({ "stroke": "gray", "stroke-width": "0.15vh" }).attrs({ x1: 0.9*this.width*innerWidth, y1: -0.6*this.height*innerHeight, x2: 0.9*this.width*innerWidth, y2: 0 });
    this.aux_spring_path.styles({ "fill": "none", "stroke": "gray", "stroke-width": "0.15vh" });
    this.aux_spring_support.styles({ "stroke": "gray", "stroke-width": "0.15vh" }).attrs({ x1: 0, y1: -0.3*this.block_width, x2: 0, y2: 0.3*this.block_width });
  
    this.update();
}
  
/*********************************************************/
  
Schematic.prototype.update = function(){
    if(this.oscillator.auxSpringConstant.value == 0){
      this.aux_spring_g.style("display", "none");
    } else{
      this.aux_spring_g.style("display", null);
    }
  
    if(this.oscillator.dampingConstant.value == 0){
      this.damper_g.style("display", "none");
    } else{
      this.damper_g.style("display", null);
    }
  
    if(this.oscillator.springConstant.value == 0){
      this.spring_g.style("display", "none");
    } else{
      this.spring_g.style("display", null);
    }
  
    this.initialPosition_vector.attrs({ x1: this.distance_scale(0), x2: this.distance_scale(this.oscillator.initialPosition.value), y1: 20, y2: 20 });
    this.initialPosition_marker.attrs({ x: this.distance_scale(this.oscillator.initialPosition.value)+15, y: 17 });
    if(this.oscillator.initialPosition.value == 0){
      this.initialPosition_vector.styles({ 'display': 'none' }); this.initialPosition_marker.styles({ 'display': 'none' }); 
    } else { 
      this.initialPosition_vector.styles({ 'display': null }); this.initialPosition_marker.styles({ 'display': null }); 
    }
  
    var temp_x = this.distance_scale(this.oscillator.initialPosition.value) + 0.5*this.block_width, temp_y = 0 - 0.5*this.block_width;
    this.initialVelocity_vector.attrs({ x1: temp_x, x2: temp_x + 10*this.oscillator.initialVelocity.value, y1: temp_y, y2: temp_y });
    this.initialVelocity_marker.attrs({ x: temp_x + 10*this.oscillator.initialVelocity.value + 10, y: temp_y });
    if(this.oscillator.initialVelocity.value == 0){
      this.initialVelocity_vector.styles({ 'display': 'none' }); this.initialVelocity_marker.styles({ 'display': 'none' }); 
    } else { 
      this.initialVelocity_vector.styles({ 'display': null }); this.initialVelocity_marker.styles({ 'display': null }); 
    }
  
    var temp_x = this.distance_scale(this.oscillator.initialPosition.value), temp_y = -1*this.block_width - 10;
    this.excitingForce_vector.attrs({ x1: temp_x, x2: temp_x + 10*this.oscillator.excitingMagnitude.value, y1: temp_y, y2: temp_y });
    this.excitingForce_marker.attrs({ x: temp_x + 10*this.oscillator.excitingMagnitude.value + 10, y: temp_y });
    if(this.oscillator.excitingMagnitude.value == 0 || this.oscillator.excitingFrequency.value == 0){ 
      this.excitingForce_vector.styles({ 'display': 'none' }); this.excitingForce_marker.styles({ 'display': 'none' }); 
    } else { 
      this.excitingForce_vector.styles({ 'display': null }); this.excitingForce_marker.styles({ 'display': null }); 
    }
  
    this.simulate();
}
  
/*********************************************************/
  
Schematic.prototype.simulate = function(index=0){
    if(index==1){
        this.simulate_start();
        currentIndex = this.index;
        this.excitingForce_vector.styles({ 'display': 'none' });
    }
    let currentState = this.oscillator.system_States[currentIndex];

    posX = this.distance_scale(currentState.disp);
    block_width = this.block_width;
    this.block.attrs({ x: posX - 0.5*block_width, y: -block_width });
  
    spring_length = posX - 0.5*block_width;
    path = []; numberOfTurns = 20; unit_length = 0.8*spring_length/numberOfTurns;
    path.push({x: 0, y: 0});
    temp_x = 0.1*spring_length;
    path.push({x: temp_x, y: 0});
    for(i = 0; i < numberOfTurns; i++){
      temp_x += 0.25*unit_length;
      path.push({ x: temp_x, y: -0.1*block_width });
      temp_x += 0.5*unit_length;
      path.push({ x: temp_x, y: 0.1*block_width });
      temp_x += 0.25*unit_length;
      path.push({ x: temp_x, y: 0 });
    }
    temp_x += 0.1*spring_length;
    path.push({ x: temp_x, y: 0 })
    this.spring_path.attrs({ d: this.lineGenerator(path) });
  
    damper_length = spring_length;
    damper_width = 0.1*block_width; damper_height = 0.2*block_width;
    path = "";
    path += "M 0 0";
    path += "L " +(0.5*damper_length - 0.2*damper_width)+ " 0";
    path += "M " +(0.5*damper_length - 0.2*damper_width)+ " " + (-0.08*block_width);
    path += "L " +(0.5*damper_length - 0.2*damper_width)+ " " + (0.08*block_width);
    path += "M " +(0.5*damper_length - 0.5*damper_width)+ " " + (-0.1*block_width);
    path += "L " +(0.5*damper_length + 0.5*damper_width)+ " " + (-0.1*block_width);
    path += "L " +(0.5*damper_length + 0.5*damper_width)+ " " + (0.1*block_width);
    path += "L " +(0.5*damper_length - 0.5*damper_width)+ " " + (0.1*block_width);
    path += "M " +(0.5*damper_length + 0.5*damper_width)+ " 0";
    path += "L " +(damper_length)+ " 0"
  
    this.damper_path.attrs({ d: path });
  
    var temp_x = this.distance_scale(currentState.disp);
    this.zeroMark.attrs({ x1: temp_x, y1: 0.05*this.height*innerHeight, x2: temp_x, y2: 0 });
  
    aux_posX = currentState.disp > 0 ? posX + 0.5*block_width : this.distance_scale(0) + 0.5*block_width;
    this.aux_spring_g.attrs({ "transform": "translate(" +(aux_posX)+ ", " +(-0.5*this.block_width)+ ")" });
    spring_length = 0.9*this.width*innerWidth - aux_posX;
    path = []; numberOfTurns = 20; unit_length = 0.8*spring_length/numberOfTurns;
    path.push({x: 0, y: 0});
    temp_x = 0.1*spring_length;
    path.push({x: temp_x, y: 0});
    for(i = 0; i < numberOfTurns; i++){
      temp_x += 0.25*unit_length;
      path.push({ x: temp_x, y: -0.1*block_width });
      temp_x += 0.5*unit_length;
      path.push({ x: temp_x, y: 0.1*block_width });
      temp_x += 0.25*unit_length;
      path.push({ x: temp_x, y: 0 });
    }
    temp_x += 0.1*spring_length;
    path.push({ x: temp_x, y: 0 })
    this.aux_spring_path.attrs({ d: this.lineGenerator(path) });

    if(simulationRunning){
      var temp_x = this.distance_scale(currentState.disp), temp_y = -1*this.block_width - 10;
      this.excitingForce_vector.attrs({ x1: temp_x, x2: temp_x + 10*currentState.appliedForce });
    }
}
  
/*********************************************************/
  
Schematic.prototype.simulate_start = function(){
    this.initialPosition_vector.styles({ 'display': 'none' });
    this.initialPosition_marker.styles({ 'display': 'none' });
    this.initialVelocity_vector.styles({ 'display': 'none' });
    this.initialVelocity_marker.styles({ 'display': 'none' });
//     this.excitingForce_vector.styles({ 'display': 'none' });
    this.excitingForce_marker.styles({ 'display': 'none' });
}

/*********************************************************/

Schematic.prototype.simulate_end = function(){
    this.update();
}

Schematic.prototype.simulateNext = function(){
    if(this.index<(this.maxIndex)){
        this.index++;
        this.simulate(1);
    }
}

Schematic.prototype.simulatePrev = function(){
    if(this.index>0){
        this.index--;
        this.simulate(1);
    }
}

Schematic.prototype.checkIndex = function(){
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.index=0;
}