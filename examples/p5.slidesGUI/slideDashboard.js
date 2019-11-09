
function setup() {
  UI = new p5.slidesUI(canvas);
}

// START PRESENTATION LOOP

function draw() {
  UI.display();
  UI.checkInteraction();
}