const redRect = ( sketch ) => {
    sketch.setup = function () {
        sketch.w = width;
        sketch.h = height;
        let myCanvas = createCanvas(sketch.w, sketch.h);
        myCanvas.size(width,height);
        myCanvas.position(0,0);
        CANVAS_TRANSPORTER = myCanvas;
    }

    sketch.draw = function () {
        sketch.fill(255, 0, 0)

        sketch.rect(0, 0,mouseX, mouseY)

    }
}