const redRect = ( sketch ) => {
    sketch.setup = function () {
        let myCanvas = createCanvas(width, height);
        CANVAS_TRANSPORTER = myCanvas;
    }

    sketch.draw = function () {
        sketch.fill(255, 0, 0)

        sketch.rect(0, 0,mouseX, mouseY)

    }
}