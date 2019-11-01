// GLOBAL VARIABLES
// Colors
backOne = 'black';
backTwo = 'white';

// Scene-Tracking Variables
let scene = 0;
let toggle = 0;

// Dynamic Text Parameters
let margins;
let widthFraction = 24;
let textBounds;
let xBounds;

// Placeholder for Active Decks
let deck;



// SETUP FUNCTION TO INITIALIZE THE TITLE SLIDE
function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  deck = new p5.SlideDeck(); // slide deck object
  
// let sketchVec = [];
//   sketchVec.push(redRect);
//   sketchVec.push(perlinRect);
  
// Add Four Slides  
deck.addSlides(4);
  
deck.addSketches(1,[sketchTemplate]);
deck.setTemplate(1,'full-text');
deck.setMargins(1,width/widthFraction);
deck.setHeading(1,'How to Use p5.Slides');
deck.panelConfig(1,1);
deck.setSubheading(1,'Use Numbers to Navigate');
  
deck.setHeading(2,'Basic Template');
deck.setTemplate(2,'mid-title');
deck.panelConfig(2,1);
deck.setMargins(2,width/widthFraction);
deck.addSketches(2,[redRect]); 
  
deck.setHeading(3,'Sketch Formatting');
deck.setTemplate(3,'low-header');
deck.panelConfig(3,1);
deck.setMargins(3,width/widthFraction);
deck.addSketches(3,[KaleidoParticles]); 
  
deck.setHeading(4,'Functions');
deck.setTemplate(4,'full-sketch');
deck.panelConfig(4,1);
deck.setMargins(4,width/widthFraction);
deck.addSketches(4,[perlinRect]);
  
deck.setHeading(5,'Animations');
deck.setTemplate(5,'low-header');
deck.panelConfig(5,1);
deck.setMargins(5,width/widthFraction);
deck.addSketches(5,[blueRect]);
  
}

// START PRESENTATION LOOP

function draw() {
  
  deck.playCurrentSlide();
  console.log(deck.currentSlide);
  
}