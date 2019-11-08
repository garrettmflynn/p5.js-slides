
/* PS.SLIDES
   Written by Garrett Flynn | November 2019

*/


// UI Object
p5.slidesUI = function() {
  this.decks = [];
  NUMDECKS = 0;
  TOGGLED = 0;
  REVISION_TOGGLE = true;
  CURRENT_DECK = 1;
  NEWOBJS_ = null;

  SIDEBAR_SIZEY = height/10;
  SIDEBAR_SIZEX = width/6;
  createSidebar();
};

// Interaction Checker
p5.slidesUI.prototype.checkInteraction = function(){

  PRESENT_BUTTON.mousePressed(TO_PRESENTMODE);
  EDIT_BUTTON.mousePressed(TO_EDITMODE);
  //EDIT_BUTTON.mouseOver(TEXT_HEADER);
  HEADER_BUTTON.mousePressed(TEXT_HEADER);
  SAVE_BUTTON.mousePressed(SAVE_SLIDES);
  NEWDECK_BUTTON.mousePressed(NEWDECK);
  ADDSLIDE_BUTTON.mousePressed(ADDSLIDE);

  if (NEWOBJS_ != null) {
    this.decks.push(NEWOBJS_);
    showDeckTabs(this.decks);
  }

  for (let i = 0; i < DECK_TABS.length; i++){
    DECK_TABS[i].mousePressed(SWITCHDECK);
  }


  NEWOBJS_ = null;

}

// UI Display
p5.slidesUI.prototype.display = function() {



  if (this.decks.length != 0){
    // revise slide deck if necessary

    if (REVISION_TOGGLE){
      this.decks[CURRENT_DECK-1].addSlides(2);
      REVISION_TOGGLE = null;
    }


    //define complementary colors for background and text
    background(color(0,0,0));

    slideTemplates(this.decks[CURRENT_DECK-1].templates[CURRENTSLIDE - 1], this.decks[CURRENT_DECK-1].headings[CURRENTSLIDE - 1], this.decks[CURRENT_DECK-1].subheadings[CURRENTSLIDE - 1], this.decks[CURRENT_DECK-1].numPanels[CURRENTSLIDE - 1], this.decks[CURRENT_DECK-1].labelVecs[CURRENTSLIDE - 1], color(255,255,255));

    if (TOGGLED == true) {

      // clear previous sketches
      for (let i = 0; i < this.decks[CURRENT_DECK-1].active.length; i++) {
        this.decks[CURRENT_DECK-1].active[i].remove();
      }


      // place new sketches
      let sketchesForSlide = this.decks[CURRENT_DECK-1].sketches[CURRENTSLIDE - 1];


      let p = this.decks[CURRENT_DECK-1].numPanels[CURRENTSLIDE - 1];

      X_BOUNDS = [];
      this.decks[CURRENT_DECK-1].active = [];

      for (let i = 0; i < p; i++) {

        X_BOUNDS = [(i) * width / p, (i + 1) * width / p];

        this.decks[CURRENT_DECK-1].active[i] = new p5(sketchesForSlide[i]);

      }

      TOGGLED = false;
      PREVKEY = "";
    }

    // show slide number
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    text(CURRENTSLIDE + '/' + this.decks[CURRENT_DECK-1].deckLength,width,height);

  }
}




// SLIDE DECK OBJECT


p5.slideDeck = function(name) {

  TOGGLED = true;
  MARGINS = width / 24;
  PREVKEY = "";
  Y_BOUNDS = 0;
  X_BOUNDS = 0;

  this.name = name;
  this.sketches = []; // initialize the sketch array
  this.deckLength = 0;
  this.templates = [];
  this.headings = [];
  this.subheadings = [];
  this.numPanels = [];
  this.panelLayouts = [];
  this.labelVecs = [];
  CURRENTSLIDE = 1;
  this.active = [];
  this.xBounds = [];
  this.bColors = [];
  this.colorOptions = [color(0,0,0), color(288,288,288)];
};

// TEMPLATE CHARACTERISTICS
function slideTemplates(template, header, subheading, nPanels, labels, textColor) {

  // Determine header length for automatic sizing
  let headerLength = header.length;
  noStroke();

  if (template == 'full-text') {
    let headerStrings = split(header, ',');

    // calculate sizes
    let sizes = [];
    sizes[0] = 1.5 * (width - 2 * MARGINS) / (headerStrings[0].length);
    let potentialSizes = [];

    let count = 0;
    for (let i = 1; i < headerStrings.length; i++) {
      potentialSizes[count] = 1.50 * (width - 2 * MARGINS) / (headerStrings[i].length);
      count++;
    }

    sizes[1] = min(potentialSizes);

    let accumulatedHeight = MARGINS;
    let currentSize = 0;

    for (let s = 0; s < headerStrings.length; s++) {
      if (s == 0) {
        currentSize = sizes[s];
        textAlign(LEFT, BOTTOM);
        textStyle(BOLD);
        accumulatedHeight = MARGINS;
      } else {
        currentSize = sizes[1];
        textAlign(LEFT, TOP);
        textStyle(NORMAL);
      }

      textColor.setAlpha(255);
      fill(textColor);
      textSize(currentSize);
      text(headerStrings[s], MARGINS, height / 2 + accumulatedHeight);
      if (s != 0) {
        accumulatedHeight += currentSize + MARGINS / 2;
      } else {
        accumulatedHeight = 1.5 * MARGINS;
      }
    }

    textColor.setAlpha(100);
    fill(textColor);
    textStyle(ITALIC);
    textAlign(RIGHT, BOTTOM);
    textSize(sizes[2]);
    text(subheading, width - MARGINS, height - MARGINS);
  }

  if (template == 'full-sketch') {
    Y_BOUNDS = 0;
  }



  if (template == 'mid-title') {
    let headerSize = 1.5 * (width - 2 * MARGINS) / (headerLength);
    textColor.setAlpha(100);
    fill(textColor);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    textSize(headerSize / 2);
    text(subheading, MARGINS, (height / 2 + MARGINS / 2));


    textColor.setAlpha(255);
    fill(textColor);
    textAlign(LEFT, BOTTOM);
    textStyle(BOLD);
    textSize(headerSize);
    let headerStart = (height / 2 - MARGINS / 2);
    text(header, MARGINS, headerStart);

  }

  if (template == 'low-header') {
    let headerSize = 1.5 * (width - 2 * MARGINS) / (2 * headerLength);

    textColor.setAlpha(100);
    fill(textColor);
    textStyle(ITALIC);
    textAlign(LEFT, BOTTOM);
    textSize(headerSize / 2);
    text(subheading, MARGINS, (height - MARGINS));


    textColor.setAlpha(255);
    fill(textColor);
    textAlign(LEFT, BOTTOM);
    textStyle(BOLD);
    textSize(headerSize);
    let subSize = MARGINS + headerSize;
    let headerStart = (height - subSize);
    text(header, MARGINS, headerStart);


    Y_BOUNDS = subSize + headerSize;

  }

}





// CREATE SLIDE ELEMENTS
p5.slideDeck.prototype.addSlides = function(num) {
  // add new slide to SlideDeck object

  for (let i = 0; i < num; i++) {

    // define template creation order
    if (this.deckLength == 1){
      this.sketches[this.deckLength + (i)] = [KaleidoParticles]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'low-header';
      this.headings[this.deckLength + (i)] = 'Showcase Mode';
      this.subheadings[this.deckLength + (i)] = 'Show off a single sketch';
      this.numPanels[this.deckLength + (i)] = 1;
      this.panelLayouts[this.deckLength + (i)] = 'horizontal';
      this.labelVecs[this.deckLength + (i)] = '';
    } else if (this.deckLength == 0) {
      this.sketches[this.deckLength + (i)] = [blankSketch]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'full-text';
      this.headings[this.deckLength + (i)] = 'P5.SLIDES,INTERACTIVE PRESENTATIONS FOR THE WEB';
      this.subheadings[this.deckLength + (i)] = '';
      this.numPanels[this.deckLength + (i)] = 1;
      this.panelLayouts[this.deckLength + (i)] = 'horizontal';
      this.labelVecs[this.deckLength + (i)] = '';
    } else if (this.deckLength > 1) {
      this.sketches[this.deckLength + (i)] = [perlinRect,blankSketch,perlinCircle];
      this.templates[this.deckLength + (i)] = 'low-header';
      this.headings[this.deckLength + (i)] = 'Panel Mode';
      this.subheadings[this.deckLength + (i)] = 'Expand your visual repertoire';
      this.numPanels[this.deckLength + (i)] = 3;
      this.panelLayouts[this.deckLength + (i)] = 'horizontal';
      this.labelVecs[this.deckLength + (i)] = '';
    }

    // let options = [0,1];
    // let choice = random(options);
    let choice = 0;

    this.bColors[this.deckLength + (i)] = this.colorOptions[choice];
  }

  this.deckLength += num;
}

p5.slideDeck.prototype.addSketches = function(slide, sketchVec) {
  // assign sketches to slides in SlideDeck object


  this.sketches[slide - 1] = sketchVec;
}



// SLIDE CHARACTERISTICS

p5.slideDeck.prototype.setTemplate = function(slide, template) {
  // assign headings to slides in SlideDeck object

  this.templates[slide - 1] = template;
}

p5.slideDeck.prototype.setHeading = function(slide, heading) {
  // assign headings to slides in SlideDeck object

  this.headings[slide - 1] = heading;
}

p5.slideDeck.prototype.setSubheading = function(slide, subheading) {
  // assign subheadings to slides in SlideDeck object

  this.subheadings[slide - 1] = subheading;
}

p5.slideDeck.prototype.panelConfig = function(slide, numPanels, layout, labels) {
  // configure panels for slides in SlideDeck object

  this.numPanels[slide - 1] = numPanels;
  this.panelLayouts[slide - 1] = layout;
  this.labelVecs[slide - 1] = labels;
}



p5.slideDeck.prototype.setMargins = function(marginSize) {
  // assign margin sizes to slides in SlideDeck object

  MARGINS = marginSize;
}


p5.slideDeck.prototype.setNavMode = function(navMode) {
  // assign margin sizes to slides in SlideDeck object

  this.navMode = navMode;
}

// HARDCODED NAVIGATION FUNCTION
function keyReleased() {
  if ((key > 0) && (PREVKEY != key)) {
    CURRENTSLIDE = key;
    TOGGLED = true;
  } else if ((key === 'ArrowRight') && (PREVKEY != key)) {
    CURRENTSLIDE++;
    TOGGLED = true;
    PREVKEY = key;
  } else if ((key === 'ArrowLeft') && (CURRENTSLIDE > 1) && (PREVKEY != key)) {
    CURRENTSLIDE--;
    TOGGLED = true;
    PREVKEY = key;
  }
}


// CORE BUTTON FUNCTIONALITY

// Mode Toggling
function TO_EDITMODE() {
  PRESENT_BUTTON.show();
  EDIT_BUTTON.hide();
  EDITSIDEBAR.show();
  HEADER_BUTTON.show();
  SAVE_BUTTON.show();
  NEWDECK_BUTTON.show();
  ADDSLIDE_BUTTON.show();

  TOGGLED = true;
}

function TO_PRESENTMODE() {
  // autosave slides
  SAVE_SLIDES();


  PRESENT_BUTTON.hide();
  EDIT_BUTTON.show();
  EDITSIDEBAR.hide();
  HEADER_BUTTON.hide();
  SAVE_BUTTON.hide();
  NEWDECK_BUTTON.hide();
  ADDSLIDE_BUTTON.hide();
  TOGGLED = true;
}

// Button Functionality
function TEXT_HEADER() {
  let field = createInput('Write Your Input Here');
  field.input(myInputEvent);
  field.position(100,100);
  field.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  field.style("background","transparent");
  field.style("color","white");
}

function SAVE_SLIDES() {
  // not sure where to take this
}

function ADDSLIDE() {
  REVISION_TOGGLE = true;
  console.log('as called');
}


// Sidebar Creation
function createSidebar(){

  EDITSIDEBAR = createDiv();
  EDITSIDEBAR.id("sidebar");
  EDITSIDEBAR.size(SIDEBAR_SIZEX,height);
  EDITSIDEBAR.position(0,0);
  EDITSIDEBAR.style("background-color",color(20));

// create "edit mode" button
  EDIT_BUTTON = createButton('Edit Mode');
  EDIT_BUTTON.position(0, 0);
  EDIT_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  styleButton(EDIT_BUTTON);
  EDIT_BUTTON.hide();

// create "present mode" button
  PRESENT_BUTTON = createButton('Present Mode');
  //PRESENT_BUTTON.parent("sidebar");
  PRESENT_BUTTON.position(0, 0);
  PRESENT_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  styleButton(PRESENT_BUTTON);

// create header button
  HEADER_BUTTON = createButton('Draw Header');
  HEADER_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  HEADER_BUTTON.position(0, SIDEBAR_SIZEY);
  //HEADER_BUTTON.parent('sidebar');
  styleButton(HEADER_BUTTON);

  // create save button
  SAVE_BUTTON = createButton('Save Slides');
  SAVE_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  SAVE_BUTTON.position(0, 2*SIDEBAR_SIZEY);
  //SAVE_BUTTON.parent('sidebar');
  styleButton(SAVE_BUTTON);

  // create new deck button
  NEWDECK_BUTTON = createButton('Add Deck');
  NEWDECK_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  NEWDECK_BUTTON.position(0, 3*SIDEBAR_SIZEY);
  //NEWDECK_BUTTON.parent('sidebar');
  styleButton(NEWDECK_BUTTON);

  // create add slides button
  ADDSLIDE_BUTTON = createButton('Add Slide');
  ADDSLIDE_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  ADDSLIDE_BUTTON.position(0, 4*SIDEBAR_SIZEY);
  //ADDSLIDE_BUTTON.parent('sidebar');
  styleButton(ADDSLIDE_BUTTON);

  DECK_TABS = [];
}


function NEWDECK() {
  NUMDECKS++;
  console.log('called');
  NEWOBJS_ = new p5.slideDeck('Slide ' + NUMDECKS);
}

function SWITCHDECK() {
  CURRENT_DECK = this.id();
  //TOGGLED = true;
}

// Button Styling
function styleButton(button){
  colorMode(HSL,100);
  button.style("background-color",color(random(0,100),random(25,95),random(35,65)));
  button.style("color","#fff");
  button.style("border","none");
}



// ADDITIONAL FUNCTIONALITY

// Dynamically resize the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Add a blank sketch to your slide
const blankSketch = (sketch) => {
  sketch.w = width;
  sketch.h = height;

  sketch.setup = function() {
    let myCanvas = sketch.createCanvas(sketch.w, sketch.h);
    myCanvas.position(0, 0);
  }

  sketch.draw = function() {

  }
}

function showDeckTabs(decks){
  let tabWidth = width/decks.length;

  for (let j = 0; j < DECK_TABS.length; j++){
    DECK_TABS[j].remove();
  }
  for (let i = 0; i < decks.length; i++){
    DECK_TABS[i] = createButton(decks[i].name);
    DECK_TABS[i].size(tabWidth,SIDEBAR_SIZEY);
    DECK_TABS[i].position(tabWidth*(i), height);
    DECK_TABS[i].id(i+1);
    styleButton(DECK_TABS[i]);
  }
}




