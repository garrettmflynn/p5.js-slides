

let sketches = {};
let myDecks = {};
let UI;

function preload() {
    sketches = loadJSON('defaultSketches.json');
    //myDecks = loadJSON('myDecks.json');
}

function setup() {
    UI = new p5.SlidesUI([],sketches);
}

// START PRESENTATION LOOP

function draw() {
    UI.display();
    UI.checkInteraction();
}