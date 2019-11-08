
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight,);
  UI = new p5.slidesUI(canvas);
}

// START PRESENTATION LOOP

function draw() {
  UI.checkInteraction();
  UI.display();
}