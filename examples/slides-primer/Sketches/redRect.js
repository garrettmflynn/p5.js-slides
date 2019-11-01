const redRect = ( sketch ) => {
 
    //sketch.w = xBounds[1]-xBounds[0];
    //sketch.h = height - textBounds - margins;
  sketch.w = width;
  sketch.h = height/2;
 
    sketch.setup = function() {
      let myCanvas = sketch.createCanvas(sketch.w,sketch.h);
      //myCanvas.position(xBounds[0], textBounds + margins);
      myCanvas.position(0, 0);
    }
 
    sketch.draw = function() {
        sketch.clear();
        sketch.fill('red');
      sketch.rectMode(RADIUS);
        sketch.rect(mouseX,mouseY-sketch.h/2,50,50);
    }
}