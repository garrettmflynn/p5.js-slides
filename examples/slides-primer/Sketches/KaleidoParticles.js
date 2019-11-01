const KaleidoParticles = ( sketch ) => {
 
    sketch.points = [];
    sketch.attractors = [];
    closestCache = [];
    density = 50;
    threshold = 30;
    count = 1;
    r = 0;
    force_center = 50;
    slow_down = 40;

    sketch.setup = function() {
      
        //sketch.w = width - 2*margins
        //sketch.h = textBounds - (4*margins);
      
      sketch.w = width
      sketch.h = height/2
      
        let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
      
      myCanvas.position(0, 0);
      
      
    r = sketch.h/4;
  
    let dx = 3*width/density;
    let dy = 3*height/density;

    for (i = -1*height; i < 2*height; i += dx){
    for (j = -1*height; j < 2*height; j += dy){
      
    sketch.points.push(new Point(i,j,count));
    count++;
    
    }
  }
    }
 
    sketch.draw = function() {
    sketch.clear();
  
    sketch.attractors.push(createVector(sketch.w/2,sketch.h/2));

    for (let k = 0; k < sketch.points.length; k++) {
      
      sketch.points[k].display();
    sketch.points[k].move(sketch.attractors);
  }
    }
  
  // Point Class
class Point {
  constructor(x,y,count) {
    this.home = createVector(x,y)
    this.pos_vec = createVector(x,y);
    
    this.velocity = createVector(0,0);
    
    this.smallest_distance = 0;
    
    
  }

  move(attractors) {
    
    let den_x2 = (this.home.x-this.pos_vec.x);
    let den_y2 = (this.home.y-this.pos_vec.y);
    let home_vec = createVector(den_x2,den_y2);
    let net_force = createVector(0,0);
    let net_home = createVector(0,0);
    let smallest_distance = [];

for (i = 0; i < attractors.length; i++){
  
    let ellipse_x = attractors[i].x + (r*cos(home_vec.heading()));
    let ellipse_y = attractors[i].y + (r*sin(home_vec.heading()));
    
    let force_vec = createVector((ellipse_x-this.pos_vec.x),(ellipse_y-this.pos_vec.y));
    
    let distance = abs(dist(attractors[i].x,attractors[i].y,this.pos_vec.x,this.pos_vec.y));
  
  if (this.smallest_distance.length < 1 || this.smallest_distance > distance){
    this.smallest_distance = distance;
  }
  
    if (distance > r){
    force_vec.setMag(force_center);
    }
    else {
      force_vec.setMag(-force_center)//home_vec.mag());
    }
    
  force_vec.div(slow_down);
  net_force.add(force_vec);
  home_vec.div(slow_down);
  net_home.sub(home_vec)
}
  
    
    this.pos_vec.add(net_force);
    this.pos_vec.add(net_home);

  }

  display(points, closest, k,cutoff) {

    // Actual Point
    

    sketch.push();
    sketch.stroke('white');
    sketch.strokeWeight(1);
    sketch.translate(this.pos_vec.x, this.pos_vec.y);
    sketch.point(0,0);
    sketch.pop();

}
}
  
}
