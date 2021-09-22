/*******************************************************************/

function Oscillator(){

    this.parameters = [
        'mass', 'springConstant', 'dampingConstant', 
        'auxSpringConstant',
        'excitingMagnitude', 'excitingFrequency',
        'initialPosition', 'initialVelocity',
        'timestep'
    ];

    this.mass = { value: 1, min: 0.1, max: 10, step: 0.1 };
    this.springConstant = { value: 10, min: 0.1, max: 20, step: 0.1 };
    this.dampingConstant = { value: 0, min: 0, max: 10, step: 0.1 };
    this.auxSpringConstant = { value: 0, min: 0, max: 20, step: 0.1 };
  
    this.excitingMagnitude = { value: 0, min: 0, max: 10, step: 0.1 };
    this.excitingFrequency = { value: 2, min: 0, max: 10, step: 0.01 };
  
    this.initialPosition = { value: 4, min: 0, max: 10, step: 0.1 };
    this.initialVelocity = { value: 0, min: 0, max: 10, step: 0.1 };
  
    this.omega_Natural = null, this.zeta = null;
    this.sampling_frequency = null, this.h = null;

    this.timeSpan = 10;
    this.timestep = { value: 0.1, min: 0.01, max: 1, step: 0.01 };
  
    this.t_list = [], this.u_list = [], this.v_list = [];
    this.system_States = [], this.system_Transitions = [];
  
    this.compute();
}

/*******************************************************************/

Oscillator.prototype.compute = function(bodyId){
    m = this.mass.value; k = this.springConstant.value; c = this.dampingConstant.value;
    k_aux = this.auxSpringConstant.value;
    F = this.excitingMagnitude.value; ω = this.excitingFrequency.value;
    x0 = this.initialPosition.value; v0 = this.initialVelocity.value;

    this.omega_Natural = Math.sqrt(k/m);
    this.zeta = c/(2*Math.sqrt(k*m));

    this.sampling_frequency = (ω > this.omega_Natural && F > 0 && ω != 0) ? ω : this.omega_Natural;
    // this.h = 0.01*(2*Math.PI/this.sampling_frequency);
    this.h = this.timestep.value;
    h = this.h;
    dt = h;

    this.t_list = [], this.u_list = [], this.v_list = [];
    this.t_list[0] = 0;
    this.u_list[0] = x0;
    this.v_list[0] = v0;
    for(var i = 0; i < this.timeSpan/h; i++){
        u = this.u_list[i]; v = this.v_list[i]; t = this.t_list[i];

        k1_v = this.f_v(t, u, v);
        k1_u = this.f_u(t, u, v);
        k2_u = this.f_u( t + 0.5*h, u + 0.5*h*k1_u, v + 0.5*h*k1_v );
        k2_v = this.f_v( t + 0.5*h, u + 0.5*h*k1_u, v + 0.5*h*k1_v );
        k3_u = this.f_u( t + 0.5*h, u + 0.5*h*k2_u, v + 0.5*h*k2_v );
        k3_v = this.f_v( t + 0.5*h, u + 0.5*h*k2_u, v + 0.5*h*k2_v );
        k4_u = this.f_u( t + h, u + h*k3_u, v + h*k3_v );
        k4_v = this.f_v( t + h, u + h*k3_u, v + h*k3_v );

        this.u_list[i+1] = this.u_list[i] + (1/6)*h*(k1_u + 2*k2_u + 2*k3_u + k4_u);
        this.v_list[i+1] = this.v_list[i] + (1/6)*h*(k1_v + 2*k2_v + 2*k3_v + k4_v);
        this.t_list[i+1] = this.t_list[i] + h;
    }
    this.computeSystemStates();
    this.computeSystemTransitions();
}
/*******************************************************************/

Oscillator.prototype.f_u = function(t, u, v){
    return(v); 
}

/*******************************************************************/

Oscillator.prototype.f_v = function(t, u, v){
    let temp_u = u > 0 ? u : 0;
    return( -k*u/m - k_aux*temp_u/m - c*v/m + F*Math.sin(ω*t)/m ); // u is displacement, v is velocity
}

/*******************************************************************/

Oscillator.prototype.computeSystemStates = function(){
    this.system_States = [];
    this.system_States = this.t_list.map(d => { return {time: d}; })
    this.u_list.map((d, i) => { this.system_States[i].disp = d; });
    this.v_list.map((d, i) => { this.system_States[i].vel = d; });
    this.system_States.map(d => {
        d.acc = this.f_v(d.time, d.disp, d.vel);
        d.kineticEnergy = 0.5*m*d.vel*d.vel;
        let temp_disp = d.disp > 0 ? d.disp : 0;
        d.potentialEnergy = 0.5*k*d.disp*d.disp + 0.5*k_aux*temp_disp*temp_disp;
        d.totalEnergy = d.kineticEnergy + d.potentialEnergy;
        d.appliedForce = F*Math.sin(ω*d.time);
    });
}

/*******************************************************************/

Oscillator.prototype.computeSystemTransitions = function(){
    this.system_Transitions = [];
    for(var i = 0; i < this.system_States.length-1; i++){
        this.system_Transitions[i] = {};
        var d = this.system_Transitions[i];
        d.workDone = 0.5*(this.system_States[i].appliedForce + this.system_States[i+1].appliedForce)*(this.system_States[i+1].disp - this.system_States[i].disp);
        d.time = 0.5*(this.system_States[i].time + this.system_States[i+1].time);
    }
}
