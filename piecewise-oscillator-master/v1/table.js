function Table(oscillator){
    this.oscillator = oscillator;
    this.table = document.getElementById("table");
    this.cell = [];
    this.row = [];
    this.index = 0;
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.initialize();
}

Table.prototype.addRow = function(){
    if(this.index<(this.maxIndex)){
        this.index++;
        this.display();
    }
}

Table.prototype.removeRow = function(){
    if(this.index>0){
        this.index--;
        this.display();
    }
}

Table.prototype.display = function(){
    if(this.index==0){
        this.update();
        return;}
    if(this.index<5){
        for(var i=0;i<5;i++){
            this.cell[i][0].innerHTML = i;
            this.row[i].bgColor = null;
            if(i<=this.index){
                this.cell[i][1].innerHTML = this.oscillator.t_list[i].toFixed(2);
                this.cell[i][2].innerHTML = this.oscillator.u_list[i].toFixed(2);
                this.cell[i][3].innerHTML = this.oscillator.v_list[i].toFixed(2);
            }else{
                this.cell[i][1].innerHTML = null;
                this.cell[i][2].innerHTML = null;
                this.cell[i][3].innerHTML = null;
            }
    }
        this.row[this.index].bgColor = "#8AE15E";
        this.cell[this.index][0].innerHTML = "n = " + this.index.toString();
        if(this.index>0){
            this.row[this.index - 1].bgColor = "#FAF18B";
            this.cell[this.index-1][0].innerHTML = "(n-1) = " + (this.index-1).toString();
        }
        return;
    }
    for(var i=0;i<5;i++){
        this.cell[i][0].innerHTML = this.index - (4-i);
        if(i==3 || i==4){
            this.cell[i][0].innerHTML = (i==3)?"(n-1) = " + (this.index - (4-i)).toString():"n = " + (this.index - (4-i)).toString();
        }
        this.cell[i][1].innerHTML = this.oscillator.t_list[this.index-(4-i)].toFixed(2);
        this.cell[i][2].innerHTML = this.oscillator.u_list[this.index-(4-i)].toFixed(2);
        this.cell[i][3].innerHTML = this.oscillator.v_list[this.index-(4-i)].toFixed(2);
    }
}

Table.prototype.initialize = function(){

    for(var j=0;j<5;j++){
        this.row.push(table.insertRow(-1));
        this.cell[j] = [];
        this.cell[j].push(this.row[j].insertCell(0));
        this.cell[j].push(this.row[j].insertCell(1));
        this.cell[j].push(this.row[j].insertCell(2));
        this.cell[j].push(this.row[j].insertCell(3));
        this.cell[j][0].innerHTML = j;
        if(j == 0){
            this.cell[j][0].innerHTML = "n = " + j.toString();
            this.cell[j][1].innerHTML = this.oscillator.t_list[0].toFixed(2);
            this.cell[j][2].innerHTML = this.oscillator.u_list[0].toFixed(2);
            this.cell[j][3].innerHTML = this.oscillator.v_list[0].toFixed(2);
            this.row[j].bgColor="#FAF18B";
        }
    }
}

Table.prototype.update = function(){
    this.checkIndex();
    for(var j=0;j<5;j++){
        this.cell[j][0].innerHTML = j;
        if(j == 0){
            this.cell[j][0].innerHTML = "n = " + j.toString();
            this.cell[j][1].innerHTML = this.oscillator.t_list[0].toFixed(2);
            this.cell[j][2].innerHTML = this.oscillator.u_list[0].toFixed(2);
            this.cell[j][3].innerHTML = this.oscillator.v_list[0].toFixed(2);
            this.row[j].bgColor="#FAF18B";
        }else{
            this.cell[j][1].innerHTML = null;
            this.cell[j][2].innerHTML = null;
            this.cell[j][3].innerHTML = null;
            this.row[j].bgColor=null;
        }
    }
}

Table.prototype.checkIndex = function(){
    this.maxIndex = parseInt(this.oscillator.timeSpan/this.oscillator.timestep.value);
    this.index=0;
}

//    var row = table.insertRow(-1);
//    var cell1 = row.insertCell(0);
//    var cell2 = row.insertCell(1);
//    var cell3 = row.insertCell(2);
//    cell1.innerHTML = this.oscillator.t_list[table.rows.length - 2].toFixed(2);
//    cell2.innerHTML = this.oscillator.u_list[table.rows.length - 2].toFixed(2);
//    cell3.innerHTML = this.oscillator.v_list[table.rows.length - 2].toFixed(2);