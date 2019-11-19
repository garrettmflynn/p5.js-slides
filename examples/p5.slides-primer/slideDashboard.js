

let sketches = {};
let myDecks = {};
// img;

function preload() {
 sketches = loadJSON('defaultSketches.json');
 myDecks = loadJSON('myDecks.json');
    // img = loadImage('icons/object-selected.png');
}

function setup() {
     // img.filter(INVERT);
     // image(img,width/2,0);
     // img.save('object-selected','png');
  UI = new p5.slidesUI([],sketches);
}

// START PRESENTATION LOOP

function draw() {
  UI.display();
  UI.checkInteraction();
}