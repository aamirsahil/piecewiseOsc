/*********************************************************/
// @class Equation

function Equation(oscillator){
    this.oscillator = oscillator;
    this.visibility = { dampingForce: 0, appliedForce: 0, auxSpringForce: 0 };
    this.visibilityCount = 0;
    this.updateEquation();
}

/*********************************************************/
// @class Equation @func update

Equation.prototype.update = function(){
    if(this.oscillator.dampingConstant.value == 0){ this.visibility.dampingForce = 0; }
    else { this.visibility.dampingForce = 1; }

    if(this.oscillator.auxSpringConstant.value == 0){ this.visibility.auxSpringForce = 0; }
    else { this.visibility.auxSpringForce = 1; }

    if(this.oscillator.excitingMagnitude.value == 0 || this.oscillator.excitingFrequency.value == 0){ this.visibility.appliedForce = 0; }
    else { this.visibility.appliedForce = 1; }

    let tempCount = 0;
    for(param in this.visibility){ tempCount += this.visibility[param]; }
    if(tempCount != this.visibilityCount){
        this.visibilityCount = tempCount;
        this.updateEquation();
    }
}

/*********************************************************/
// @class Equation @func updateEquation

Equation.prototype.updateEquation = function(){
    let temp = "";
    temp += "$$ ";
    temp += "mx''+";
    if(this.visibility.dampingForce){ temp += "cx'+"; }
    temp += "kx";
    if(this.visibility.auxSpringForce){ temp += "+k'\\Delta x"; }
    temp += "=";
    if(!this.visibility.appliedForce){ temp += "0"; }
    else { temp += "F_0\sin(\\omega t)"; }
    temp += " $$";
    d3.select('#equation_panel').html(temp);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);    

    if(this.visibility.auxSpringForce){ d3.select('#aux_equation_panel').styles({ visibility: 'visible' }); }
    else{ d3.select('#aux_equation_panel').styles({ visibility: 'hidden' }); }
}