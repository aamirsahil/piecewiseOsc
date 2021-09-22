function StepCalculator(oscillator){

    this.oscillator = oscillator;
    //0:False 1:True
    //element 1:Fric
    //element 2:Aux
    //element 3:Force
    this.check = [0,0,0];
    this.pass = [true,true,true];
    this.index = 0;
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.h = this.oscillator.timestep.value;
    this.time = this.oscillator.t_list;
    this.velocity = this.oscillator.v_list;
    this.displacement = this.oscillator.u_list;
    this.m = this.oscillator.mass.value;
    this.k = this.oscillator.springConstant.value;
    this.c = this.oscillator.dampingConstant.value;
    this.kp = this.oscillator.auxSpringConstant.value;
    this.f = this.oscillator.excitingMagnitude.value;
    this.omega = this.oscillator.excitingFrequency.value;

    this.initialize();
//    d3.select('.vnplus').append("Element");
    this.text = [null,null,null];
}

StepCalculator.prototype.initialize = function(){
    d3.selectAll('.n').html(this.index);
    d3.selectAll('.nplus').html(this.index+1);
    d3.selectAll('.tn').html(this.time[this.index]);
    d3.selectAll('.xn').html(this.displacement[this.index]);
    d3.selectAll('.vn').html(this.velocity[this.index]);
    d3.selectAll('.tnplus').html("");
    d3.selectAll('.xnplus').html("");
    d3.selectAll('.vnplus').html("");
    if(this.check[0] == 1 && this.pass[0]){
        d3.select('.Fric').html(" \\( -c\\times v_0 \\) ");
        this.pass[0] = false;
    }
    if(this.check[1] == 1 && this.pass[1]){
        d3.select('.Aux').html(" \\( -k'\\times \\Delta x \\) ");
        this.pass[1] = false;
    }
    if(this.check[2] == 1 && this.pass[2]){
        d3.select('.Force').html(" \\( + F_0\\sin(\\omega t) \\) ");
        this.pass[2] = false;
    }
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

StepCalculator.prototype.addStep = function(){
    if(this.index<(this.maxIndex)){
        this.index++;
        this.display();
    }
}

StepCalculator.prototype.removeStep = function(){
    if(this.index>0){
        this.index--;
        this.display();
    }
}

StepCalculator.prototype.display = function(){
    if(this.index == 0 ){
        this.initialize();
        return;
    }
    d3.selectAll('.n').html(this.index-1);
    d3.selectAll('.tn').html(this.time[this.index-1].toFixed(2));
    d3.selectAll('.xn').html(this.displacement[this.index-1].toFixed(2));
    d3.selectAll('.vn').html(this.velocity[this.index-1].toFixed(2));
    d3.selectAll('.nplus').html(this.index);
    this.textCalc();
    //t(n+1)
    d3.selectAll('.tnplus').html(this.text[0]);
    //x(n+1)
    d3.selectAll('.xnplus').html(this.text[1]);
    //v(n+1)
    d3.selectAll('.vnplus').html(this.text[2]);
}

StepCalculator.prototype.update = function(){
    this.indexCheck();
    this.visibilityCheck();
    this.h = this.oscillator.timestep.value;
    this.time = this.oscillator.t_list;
    this.velocity = this.oscillator.v_list;
    this.displacement = this.oscillator.u_list;
    this.m = this.oscillator.mass.value;
    this.k = this.oscillator.springConstant.value;
    this.c = this.oscillator.dampingConstant.value;
    this.kp = this.oscillator.auxSpringConstant.value;
    this.f = this.oscillator.excitingMagnitude.value;
    this.omega = this.oscillator.excitingFrequency.value;
    this.display();
}

StepCalculator.prototype.visibilityCheck = function(){
    if(this.oscillator.dampingConstant.value != 0){
        this.check[0] = 1;
    }else{
        this.check[0] = 0;
        d3.select('.Fric').html(null);
        this.pass[0] = true;
     }
    if(this.oscillator.auxSpringConstant.value != 0){
        this.check[1] = 1;
    }else{
        this.check[1] = 0;
        d3.select('.Aux').html(null);
        this.pass[1] = true;
     }
    if(this.oscillator.excitingMagnitude.value != 0 && this.oscillator.excitingFrequency.value != 0){
        this.check[2] = 1;
    }else{
        this.check[2] = 0;
        d3.select('.Force').html(null);
        this.pass[2] = true;
     }
}

StepCalculator.prototype.textCalc = function(index){
    var temp = "";
    this.text[0] = this.time[this.index-1].toFixed(2).toString() + " <br> &emsp;&nbsp; + " + this.h.toFixed(2).toString() +
        "<br><br> &emsp;&nbsp;= " + this.time[this.index].toFixed(2).toString();
    this.text[1] = this.displacement[this.index-1].toFixed(2).toString() + " <br> &emsp;&nbsp; + (" +
        this.velocity[this.index].toFixed(2).toString() + ") x " + this.h.toFixed(2).toString() +
        "<br><br> &emsp;&nbsp;= " + this.displacement[this.index].toFixed(2).toString();
    this.text[2] = this.velocity[this.index-1].toFixed(2).toString() + " <br> &emsp;&nbsp; - (<sup>" + this.k.toFixed(2).toString() + "</sup>/" +
        "<sub>" + this.m.toFixed(2).toString() + "</sub>) x (" + this.displacement[this.index-1].toFixed(2).toString() +
         ") x " + this.h.toFixed(2).toString();

    if(this.check[0] == 1){
        temp += " <br> &emsp;&nbsp; - " + this.c.toFixed(2).toString() + " x (" + this.velocity[this.index-1].toFixed(2).toString()
            + ")";
    }
    if(this.check[1] == 1){
        if(this.displacement[this.index-1] > 0){
            temp += " <br> &emsp;&nbsp; - " + this.kp.toFixed(2).toString() + " x (" + this.displacement[this.index-1].toFixed(2).toString()
                + ")";
        }else{
            temp += " <br> &emsp;&nbsp; + 0"
        }
    }
    if(this.check[2] == 1){
        temp += " <br> &emsp;&nbsp;+ " + this.f.toFixed(2).toString() + " x sin(" + this.omega + " x " + this.time[this.index-1].toFixed(2).toString()
            + ")";
    }
    this.text[2] += temp +"<br><br> &emsp;&nbsp;= " + this.velocity[this.index].toFixed(2).toString();
}

StepCalculator.prototype.indexCheck = function(){
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.index=0;
}

//    this.text1 += " $$ t_{" + String(index) + "} = t_{" + String(index-1) + "} + h $$" +
//        " $$ = " + String(this.time[index-1].toFixed(2)) + " + " + String(this.h) +
//        " = " + String(this.time[index].toFixed(2)) + " $$";
//    this.text2 += " $$ x_{" + String(index) + "} = x_{" + String(index-1) + "} +v_{"
//        + String(index-1) + "}\\times h $$" +
//        " $$ = " + String(this.displacement[index-1].toFixed(2)) + " + " + String(this.displacement[index-1].toFixed(2)) +
//        "\\times " + String(this.h) + " = " + String(this.displacement[this.index].toFixed(2)) + " $$";
//    this.text3 += " $$ v_{" + String(index) + "} = v_{" + String(index-1) + "} - \\frac{k}{m}\\times x_{"
//        + String(index-1) + "}\\times h $$" + " $$ = " + String(this.velocity[index-1].toFixed(2)) +
//        " - \\frac{" + String(this.k) + "}{" + String(this.m) + "}\\times " + String(this.displacement[index-1].toFixed(2)) +
//        "\\times " + String(this.h) + " = " + String(this.velocity[index].toFixed(2)) + " $$";
//    this.text1 = "$$ t_0 = " + String(this.time[0].toFixed(2)) + " $$";
//    this.text2 = "$$ x_0 = " + String(this.displacement[0].toFixed(2)) + " $$";
//    this.text3 = "$$ v_0 = " + String(this.velocity[0].toFixed(2)) + " $$";