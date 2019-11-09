
/* PS.SLIDES
   Written by Garrett Flynn | November 2019

*/


// UI Object
p5.slidesUI = function() {
  this.decks = [];
  MAIN_CANVAS = createCanvas(windowWidth, windowHeight);
  MAIN_CANVAS.id('maincanvas');
  CANVAS_TRANSPORTER = null;
  NUMDECKS = 0;
  TOGGLED = false;
  TEXT_TOGGLES = [];
  TEXT_TOGGLES[0] = ''; // header toggle
  TEXT_TOGGLES[1] = ''; // subheader toggle
  TEXT_TOGGLES[2] = ''; // body text toggle
  CREATED_TEXT = [];
  CREATED_TEXT[0] = []; // header cache
  CREATED_TEXT[1] = []; // subheader cache
  CREATED_TEXT[2] = []; // body text cache
  REVISION_TOGGLE = true;
  CURRENTDECK = 1;
  MAXSLIDE = [];
  NEWOBJS_ = null;
  CANVAS_COUNTER = 0;

  SIDEBAR_SIZEY = height/10;
  SIDEBAR_SIZEX = width/6;
  createSidebar();
  TO_EDITMODE()
};

// Interaction Checker
p5.slidesUI.prototype.checkInteraction = function(){

  PRESENT_BUTTON.mousePressed(TO_PRESENTMODE);
  EDIT_BUTTON.mousePressed(TO_EDITMODE);
  EDIT_BUTTON.mouseOver(ON_HOVER);
  EDIT_BUTTON.mouseOut(OFF);
  HEADER_BUTTON.mousePressed(TEXT_HEADER);
  SUBHEADER_BUTTON.mousePressed(TEXT_SUBHEADER);
  BODYTEXT_BUTTON.mousePressed(TEXT_BODY);
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



  if (this.decks.length != 0) {

      textResizer();

    // add slides to existing decks if necessary
    if (REVISION_TOGGLE || this.decks[CURRENTDECK - 1].deckLength == 0) {
      this.decks[CURRENTDECK - 1].addSlides(1);
      MAXSLIDE[CURRENTDECK - 1] += 1;
      REVISION_TOGGLE = null;
    }


    //define complementary colors for background and text
    background(color(0, 0, 0));

    slideTemplates(this.decks[CURRENTDECK - 1].templates[CURRENTSLIDE - 1], this.decks[CURRENTDECK - 1].headings[CURRENTSLIDE - 1], this.decks[CURRENTDECK - 1].subheadings[CURRENTSLIDE - 1], this.decks[CURRENTDECK - 1].numPanels[CURRENTSLIDE - 1], this.decks[CURRENTDECK - 1].labelVecs[CURRENTSLIDE - 1], color(255, 255, 255));

    if (TOGGLED == true) {
      // initialize empty canvas holders
      if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] === undefined) {
        this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] = [];
      }

      // hide previous sketches
      if (PREVSLIDE != null) {
        let canvases = this.decks[CURRENTDECK - 1].canvases[PREVSLIDE - 1];
        console.log('I will hide ' + canvases.length + ' canvases')
        for (let c = 0; c < canvases.length; c++) {
          console.log(canvases[c]);
          canvases[c].hide();
        }
      }

        let sketchesForSlide = this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1];

        // initialize sketch canvases
        if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].length == 0 && sketchesForSlide.length > 0) {

          // place new sketches

          let p = this.decks[CURRENTDECK - 1].numPanels[CURRENTSLIDE - 1];

          console.log('I will add ' +sketchesForSlide.length + ' canvases')

          X_BOUNDS = [];

          for (let i = 0; i < p; i++) {

            X_BOUNDS = [SIDEBAR_SIZEX + ((i) * (MAIN_CANVAS.width / p)), SIDEBAR_SIZEX + ((i + 1) * (MAIN_CANVAS.width / p))];
            temp_ = new p5(sketchesForSlide[i]);
            // console.log(temp_);
            // console.log(CANVAS_TRANSPORTER);
            // properly size sketches
             let x_s = X_BOUNDS[1] - X_BOUNDS[0];
             let y_s = MAIN_CANVAS.height - Y_BOUNDS - MARGINS;
            let y_p = 0;
            CANVAS_TRANSPORTER.id('c' + (CANVAS_COUNTER + (i+1)));
            console.log(CANVAS_TRANSPORTER);
            CANVAS_TRANSPORTER.size(x_s,y_s);
            CANVAS_TRANSPORTER.position(X_BOUNDS[0], y_p);
            //CANVAS_TRANSPORTER.style("pointer-events", "none");
            this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].push(CANVAS_TRANSPORTER);

            CANVAS_TRANSPORTER = null;
          }
          CANVAS_COUNTER += p;
        } else {
          let canvases = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1];
          for (let i = 0; i < canvases.length; i++) {
            canvases = canvases[i].show();
          }
      }
      TOGGLED = false;
      PREVKEY = "";
  }


    // show slide number
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    text(CURRENTSLIDE + '/' + this.decks[CURRENTDECK-1].deckLength,width,height);

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
  PREVSLIDE = null;
  this.canvases = [];
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
    if (this.deckLength >= 1){
      this.sketches[this.deckLength + (i)] = [perlinRect]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'low-header';
      this.headings[this.deckLength + (i)] = 'Showcase Mode';
      this.subheadings[this.deckLength + (i)] = 'Show off a single sketch';
      this.numPanels[this.deckLength + (i)] = 1;
      this.panelLayouts[this.deckLength + (i)] = 'horizontal';
      this.labelVecs[this.deckLength + (i)] = '';
    } else if (this.deckLength == 0) {
      this.sketches[this.deckLength + (i)] = [perlinRect]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'full-text';
      this.headings[this.deckLength + (i)] = 'P5.SLIDES,INTERACTIVE PRESENTATIONS FOR THE WEB';
      this.subheadings[this.deckLength + (i)] = '';
      this.numPanels[this.deckLength + (i)] = 1;
      this.panelLayouts[this.deckLength + (i)] = 'horizontal';
      this.labelVecs[this.deckLength + (i)] = '';
    // } else if (this.deckLength > 1) {
    //   this.sketches[this.deckLength + (i)] = [perlinRect,perlinRect];
    //   this.templates[this.deckLength + (i)] = 'low-header';
    //   this.headings[this.deckLength + (i)] = 'Panel Mode';
    //   this.subheadings[this.deckLength + (i)] = 'Expand your visual repertoire';
    //   this.numPanels[this.deckLength + (i)] = 3;
    //   this.panelLayouts[this.deckLength + (i)] = 'horizontal';
    //   this.labelVecs[this.deckLength + (i)] = '';
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
  if ((key > 0) && (PREVKEY != key) && (key <= MAXSLIDE[CURRENTDECK-1])) {
    PREVSLIDE = CURRENTSLIDE;
    CURRENTSLIDE = key;
    TOGGLED = true;
  } else if ((key === 'ArrowRight') && (PREVKEY != key) && (CURRENTSLIDE < MAXSLIDE[CURRENTDECK-1])) {
    PREVSLIDE = CURRENTSLIDE;
    CURRENTSLIDE++;
    TOGGLED = true;
    PREVKEY = key;
  } else if ((key === 'ArrowLeft') && (CURRENTSLIDE > 1) && (PREVKEY != key)) {
    PREVSLIDE = CURRENTSLIDE;
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
  MAIN_CANVAS.size(windowWidth-SIDEBAR_SIZEX,windowHeight);
  MAIN_CANVAS.position(SIDEBAR_SIZEX,0);

  TOGGLED = true;
}

function TO_PRESENTMODE() {
  // autosave slides
  SAVE_SLIDES();


  PRESENT_BUTTON.hide();
  EDIT_BUTTON.show();
  EDITSIDEBAR.hide();
  TOGGLED = true;

  MAIN_CANVAS.size(windowWidth,windowHeight);
  MAIN_CANVAS.position(0,0);
}

// Button Functionality
function ON_HOVER() {
 this.style('background-color','green');
  this.style('opacity','.3');
}

function OFF() {
  this.style('background-color','transparent');
  this.style('opacity','1');
}


function TEXT_HEADER() {
  TEXT_TOGGLES[0] = 'waituntilended';
  console.log('waituntilended');
}

function TEXT_SUBHEADER() {
  TEXT_TOGGLES[1] = 'waituntilended';
}

function TEXT_BODY() {
  TEXT_TOGGLES[2] = 'waituntilended';
}

function SAVE_SLIDES() {
  // not sure where to take this
}

function ADDSLIDE() {
  REVISION_TOGGLE = true;
  TOGGLE = true;
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
  PRESENT_BUTTON.parent("sidebar");
  PRESENT_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  styleButton(PRESENT_BUTTON);

  // create new deck button
  NEWDECK_BUTTON = createButton('Add Deck');
  NEWDECK_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  NEWDECK_BUTTON.parent('sidebar');
  styleButton(NEWDECK_BUTTON);

  // create add slides button
  ADDSLIDE_BUTTON = createButton('Add Slide');
  ADDSLIDE_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  ADDSLIDE_BUTTON.parent('sidebar');
  styleButton(ADDSLIDE_BUTTON);

// create header button
  HEADER_BUTTON = createButton('Draw Header');
  HEADER_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  HEADER_BUTTON.parent('sidebar');
  styleButton(HEADER_BUTTON);

  // create subheader button
  SUBHEADER_BUTTON = createButton('Draw Subheader');
  SUBHEADER_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  SUBHEADER_BUTTON.parent('sidebar');
  styleButton(SUBHEADER_BUTTON);

  // create body button
  BODYTEXT_BUTTON = createButton('Draw Body Text');
  BODYTEXT_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  BODYTEXT_BUTTON.parent('sidebar');
  styleButton(BODYTEXT_BUTTON);

  // create save button
  SAVE_BUTTON = createButton('Save Slides');
  SAVE_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  SAVE_BUTTON.parent('sidebar');
  styleButton(SAVE_BUTTON);

  DECK_TABS = [];
}


function NEWDECK() {
  console.log(NUMDECKS);
  if (NUMDECKS == 0){
    TOGGLE = true;
  }
  NUMDECKS++;
  MAXSLIDE[NUMDECKS-1] = 0;
  NEWOBJS_ = new p5.slideDeck('Slide ' + NUMDECKS);
}

function SWITCHDECK() {
  let ID_ = this.id();
  let regexp = '\\d+';
  ID_ = match(ID_, regexp);
  CURRENTDECK = int(ID_[0]);
  CURRENTSLIDE = 1;
  TOGGLED = true;
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
    CANVAS_TRANSPORTER = myCanvas;
  }

  sketch.draw = function() {

  }
}

function showDeckTabs(decks){
  let tabWidth = null;
  let tabDiff = (decks.length - DECK_TABS.length);

  // add new tabs if necessary
  for (let j = tabDiff; j > 0; j--){
    DECK_TABS.push(createButton(decks[decks.length-j].name));
    DECK_TABS[DECK_TABS.length-1].id('decktab' + (j+1));
    styleButton(DECK_TABS[DECK_TABS.length-1]);
  }

// update & show created tabs
  for (let i = 0; i < DECK_TABS.length; i++) {
    tabWidth = windowWidth/DECK_TABS.length;
    DECK_TABS[i].size(tabWidth,SIDEBAR_SIZEY);
    DECK_TABS[i].position(tabWidth*(i),windowHeight);
    DECK_TABS[i].show;
  }
}


function touchStarted(){

  // Text drawing actions
  for (let i = 0; i < TEXT_TOGGLES.length; i++) {
    if (TEXT_TOGGLES[i] == 'onstart') {
      console.log('started');
      TEXT_TOGGLES[i] = [mouseX,mouseY];
    }
  }
}

function touchEnded() {


  // Text drawing actions
  for (let i = 0; i < TEXT_TOGGLES.length; i++) {
  if (TEXT_TOGGLES[i] == 'waituntilended') {
    console.log('onstart');
    TEXT_TOGGLES[i] = 'onstart';
  } else if (TEXT_TOGGLES[i].length == 2) {
    console.log('stopped');
    let field = createElement('textarea').attribute('maxlength', 500).size(100, 50);
    field.attribute('wrap', 'hard');
    TEXT_TOGGLES[i].push(mouseX,mouseY);
    console.log(TEXT_TOGGLES[i]);
    field.position(SIDEBAR_SIZEX + TEXT_TOGGLES[i][0], TEXT_TOGGLES[i][1]);
    field.size(abs(TEXT_TOGGLES[i][2] - TEXT_TOGGLES[i][0]), abs(TEXT_TOGGLES[i][3] - TEXT_TOGGLES[i][1]));
    field.style("background", "transparent");
    field.style("color", "white");
    field.style("border", "none");
    TEXT_TOGGLES[i] = '';
    CREATED_TEXT[i].push(field);
  }
}
}



function textResizer() {

  for (let i = 0; i < CREATED_TEXT.length; i++) {
    for (let j = 0; j < CREATED_TEXT[i].length; j++) {
      let font = 0;

      if (i == 0) {
        font = width / 10;
      } else if (i == 1) {
        font = width / 20;
      } else {
        font = width / 30;
      }

      console.log(font);

      CREATED_TEXT[i][j].style("font-size", font + "px");

    }
  }
}