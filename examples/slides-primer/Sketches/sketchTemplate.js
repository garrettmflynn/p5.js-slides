const sketchTemplate = ( sketch ) => {

  sketch.w = width;
  sketch.h = height/2;
 
    sketch.setup = function() {
      let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
myCanvas.position(0, height-sketch.h);
    }
 
    sketch.draw = function() {
        sketch.clear();
        // sketch.(any sketch-specific attributes)
    }
}