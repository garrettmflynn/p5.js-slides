const KaleidoParticles = ( sketch ) => {

    sketch.points = [];
    sketch.attractors = [];
    closestCache = [];
    density = 50;
    count = 1;
    r = 0;
    force_center = 50;
    slow_down = 40;

    sketch.setup = function() {

        sketch.w = abs(X_BOUNDS[1]-X_BOUNDS[0]);

        sketch.totalMargins = (2*MARGINS);
        sketch.h = abs(Y_BOUNDS[1]-Y_BOUNDS[0]);

        //sketch.xTrans = (width-sketch.w)/2;

        let myCanvas = sketch.createCanvas(sketch.w,sketch.h);

        myCanvas.position(min(X_BOUNDS), min(Y_BOUNDS));
        CANVAS_TRANSPORTER = myCanvas;
        r = sketch.h/4;

        let dx = 3*sketch.w/density;
        let dy = 3*sketch.h/density;

        for (i = -1*sketch.w; i < 2*sketch.w; i += dx){
            for (j = -1*sketch.h; j < 2*sketch.h; j += dy){

//        let dx = sketch.w/density;
//     let dy = sketch.h/density;

//     for (i = 0; i < sketch.w; i += dx){
//     for (j = 0; j < sketch.h; j += dy){

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
