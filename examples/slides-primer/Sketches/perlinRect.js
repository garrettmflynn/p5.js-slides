const perlinRect = ( sketch ) => {


time = 0;
s = 20;
sketch.rows;
sketch.cols;
numParts = 1000;
noise_level = 0.1

sketch.particle = [];
sketch.flowField = [];
  
  sketch.w = width;
  sketch.h = height/2;


sketch.setup = function() {
  
  let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
  myCanvas.position(0, 0);
  sketch.pixelDensity(1);
  sketch.clear();
  sketch.cols = floor(width/s);
  sketch.rows = floor(height/s);
  
  for (let i = 0; i < numParts; i++){
  sketch.particle.push(new Particle());
    
  }
}
  
sketch.draw = function(){
    //background(2000);
  
    let yoff = 100;
  for (let y = 0; y < sketch.rows; y++){
    let xoff = 0;
    for (let x = 0; x < sketch.cols; x++) {
      
      let index = (x + y *sketch.cols)
     let angle = noise(xoff,yoff,time)*4*TWO_PI;
      //let angle = noise(xoff,yoff)*TWO_PI;
      
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      sketch.flowField[index] = v;
      
      xoff += noise_level;
      
//       stroke(0);
//       strokeWeight(1);
      
//       push();
//       translate(x*s,y*s);
//       rotate(v.heading());
//       line(0,0,s,0);
//       pop();
    }
      yoff += noise_level;
  }
  
  time += 0.001;
  
  
  for (let i = 0; i < sketch.particle.length; i++){
    
sketch.particle[i].follow(sketch.flowField);
sketch.particle[i].update();
sketch.particle[i].bounds();     
sketch.particle[i].show();
sketch.particle[i].updatePrev();
  }

}

class Particle {
  
  constructor(x,y) {
  this.pos = createVector(random(0,width),random(0,height));
  this.vel = createVector(0,0);
  this.acc = createVector(0,0);
    this.maxSpeed = 10;
    this.prevPos = this.pos.copy();
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }
  
  applyForce(force){
    this.acc.add(force);
  }
  
  show() {
    sketch.stroke(288,20);
    sketch.strokeWeight(1);
    
    //point(this.pos.x, this.pos.y);
    sketch.line(this.pos.x,this.pos.y, this.prevPos.x, this.prevPos.y);
    
    this.updatePrev();
  }
  
  updatePrev(){
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  }
  
  bounds(){
    
    let ub_x = sketch.w*(9/10);
    let lb_x = sketch.w/10;
    let ub_y = sketch.h*(9/10);
    let lb_y = sketch.h/10;
    
    
    if (this.pos.x > ub_x){
      this.pos.x = lb_x;
      this.updatePrev();
    }
    if (this.pos.x < lb_x){
      this.pos.x = ub_x;
      this.updatePrev();
    }
    if (this.pos.y > ub_y){
      this.pos.y = lb_y;
      this.updatePrev();
    }
    if (this.pos.y < lb_y){
      this.pos.y = ub_y;
      this.updatePrev();
    }
    
  }
  
  follow(vectors){
    let x = floor(this.pos.x / s);
    let y = floor(this.pos.y / s);
    var index = x+y * sketch.cols;
    let force = vectors[index];
    this.applyForce(force);
  }
}
}