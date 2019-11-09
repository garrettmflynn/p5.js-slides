const perlinCircle = ( sketch ) => {

  let time = 0;
  sketch.scale = 20;
  sketch.rowss = 0;
  sketch.cols = 0;
  let numParts = 1000;
  let noise_level = 0.1
  sketch.centerPoint = 0;

  sketch.radius = 0;

  sketch.particle = [];
  sketch.flowField = [];

  sketch.w = abs(X_BOUNDS[1]-X_BOUNDS[0]);
  sketch.h = abs(Y_BOUNDS[1]-Y_BOUNDS[0]);


  sketch.setup = function() {
    let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
    myCanvas.position(min(X_BOUNDS),min(Y_BOUNDS));
    CANVAS_TRANSPORTER = myCanvas;
    sketch.pixelDensity(1);
    sketch.clear();
    sketch.background(0);
    sketch.sizeArray = [sketch.w,sketch.h];
    sketch.cols = floor(width/sketch.scale);
    sketch.rows = floor(height/sketch.scale);
    sketch.radius = min(sketch.sizeArray)/2;
    sketch.centerPoint = createVector(sketch.w/2,sketch.h/2);

    for (let i = 0; i < numParts; i++){
      sketch.particle[i] = new Particle(sketch.radius, sketch.centerPoint);
    }
  }

  sketch.draw = function() {
    //background(200);

    let yoff = 0;
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
      }
      yoff += noise_level;
    }


    time += 0.001;

    for (let i = 0; i < sketch.particle.length; i++){

      sketch.particle[i].follow(sketch.flowField);
      sketch.particle[i].update();
      sketch.particle[i].bounds();
      sketch.particle[i].show(sketch.centerPoint);
      sketch.particle[i].updatePrev();
    }
  }


  function keyPressed() {
    if (keyCode === ENTER) {
      background(200);
    } else if (keyCode === RIGHT_ARROW) {
      //value = 0;
    }
  }

  class Particle {

    constructor(radiusMax,centerPoint) {
      this.pos = p5.Vector.fromAngle(random(0,2*PI),random(0,radiusMax));

      this.radiusMax = radiusMax;
      this.centerPoint = centerPoint;

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

    show(centerPoint) {
      sketch.stroke(288,50);
      sketch.strokeWeight(1);
      sketch.push();
      sketch.translate(this.centerPoint.x,this.centerPoint.y);
      //sketch.ellipse(this.pos.x, this.pos.y,10,10);
      sketch.line(this.pos.x,this.pos.y, this.prevPos.x, this.prevPos.y);
      sketch.pop();

      this.updatePrev();
    }

    updatePrev(){
      this.prevPos.x = this.pos.x;
      this.prevPos.y = this.pos.y;
    }

    bounds(){
      let diff_x = this.pos.x;
      let diff_y = this.pos.y;
      let dist_guess= int(dist(0,0,this.pos.x, this.pos.y));

      if (dist_guess > this.radiusMax){

        if (this.pos.mag() > 0) {
          this.pos.setMag(-this.radiusMax);
        } else if (this.pos.mag() < 0) {
          this.pos.setMag(this.radiusMax);
        }

        this.updatePrev();
      }

    }

    follow(vectors){
      let x = floor((this.pos.x+this.centerPoint.x) / sketch.scale);
      let y = floor((this.pos.y+this.centerPoint.y) / sketch.scale);
      var index = x+y * sketch.cols;
      let force = vectors[index];
      this.applyForce(force);
    }
  }
}