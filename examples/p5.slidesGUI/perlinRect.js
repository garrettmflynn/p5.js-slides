const perlinRect = ( sketch ) => {


  let time = 0;
  sketch.s = 20;
  sketch.rows;
  sketch.cols;
  let numParts = 1000;
  let noise_level = 0.1;
  sketch.centerPoint = 0;

  sketch.particle = [];
  sketch.flowField = [];

  sketch.w = abs(X_BOUNDS[1]-X_BOUNDS[0]);
  sketch.h = abs(Y_BOUNDS[1]-Y_BOUNDS[0]);


  sketch.setup = function() {

    let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
    myCanvas.position(min(X_BOUNDS), min(Y_BOUNDS));
    CANVAS_TRANSPORTER = myCanvas;
    sketch.pixelDensity(1);
    sketch.clear();
    sketch.sizeArray = [sketch.w,sketch.h];

    // sketch.cols = floor(min(sketch.sizeArray)/sketch.s);
    // sketch.rows = floor(min(sketch.sizeArray)/sketch.s);
    sketch.cols = floor(sketch.w/sketch.s);
    sketch.rows = floor(sketch.h/sketch.s);

    sketch.centerPoint = createVector(sketch.w/2,sketch.h/2);

    for (let i = 0; i < numParts; i++){
      sketch.particle.push(new Particle(sketch.centerPoint));

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

    constructor(center) {
      this.pos = createVector(random(0,width),random(0,height));
      this.vel = createVector(0,0);
      this.acc = createVector(0,0);
      this.maxSpeed = 10;
      this.prevPos = this.pos.copy();
      this.centerPoint = center;
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
      sketch.push();
      sketch.translate(this.centerPoint.x-min(sketch.sizeArray)/2,this.centerPoint.y-min(sketch.sizeArray)/2);
      sketch.line(this.pos.x,this.pos.y, this.prevPos.x, this.prevPos.y);
      sketch.pop();

      this.updatePrev();
    }

    updatePrev(){
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    bounds(){

      let ub_x = min(sketch.sizeArray)*(9/10);
      let lb_x = min(sketch.sizeArray)/10;
      let ub_y = min(sketch.sizeArray)*(9/10);
      let lb_y = min(sketch.sizeArray)/10;


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
      let x = floor(this.pos.x / sketch.s);
      let y = floor(this.pos.y / sketch.s);
      var index = x+y * sketch.cols;
      let force = vectors[index];
      this.applyForce(force);
    }
  }
}