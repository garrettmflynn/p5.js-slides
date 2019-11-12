
// function preload() {
//   data = loadJSON('assets/bubbles.json');
// }

let savedDecks;


function setup() {
  UI = new p5.slidesUI(savedDecks);
}

// START PRESENTATION LOOP

function draw() {
  UI.display();
  UI.checkInteraction();
}