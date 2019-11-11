
/* PS.SLIDES
   Written by Garrett Flynn | November 2019

*/


// UI Object
p5.slidesUI = function() {
  DECKS = [];
  MAIN_CANVAS = createCanvas(windowWidth, windowHeight);
  MAIN_CANVAS.id('maincanvas');
  CANVAS_TRANSPORTER = null;
  NUMDECKS = 0;
  TOGGLED = false;
  TRACKED_TOUCHES = '';
  DRAW_FROM_TOUCH = '';
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
  ADDSKETCH_BUTTON.mousePressed(SKETCH_PLACEMENT);
  SAVE_BUTTON.mousePressed(SAVE_SLIDES);
  NEWDECK_BUTTON.mousePressed(NEWDECK);
  ADDSLIDE_BUTTON.mousePressed(ADDSLIDE);

  if (NEWOBJS_ != null) {
    DECKS.push(NEWOBJS_);
    showDeckTabs(DECKS);
  }

  for (let i = 0; i < DECK_TABS.length; i++){
    DECK_TABS[i].mousePressed(SWITCHDECK);
  }


  NEWOBJS_ = null;

}

// UI Display
p5.slidesUI.prototype.display = function() {



  if (DECKS.length != 0) {

      textResizer();

    // add slides to existing decks if necessary
    if (REVISION_TOGGLE || DECKS[CURRENTDECK - 1].deckLength == 0) {
      DECKS[CURRENTDECK - 1].addSlides(1);
      MAXSLIDE[CURRENTDECK - 1] += 1;
      REVISION_TOGGLE = null;
    }


    //define complementary colors for background and text
    background(color(0, 0, 0));

    slideTemplates(DECKS[CURRENTDECK - 1].templates[CURRENTSLIDE - 1], DECKS[CURRENTDECK - 1].headings[CURRENTSLIDE - 1], DECKS[CURRENTDECK - 1].subheadings[CURRENTSLIDE - 1], color(255, 255, 255));

    if (TOGGLED == true) {
      // initialize empty canvas holders
      if (DECKS[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] === undefined) {
        DECKS[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] = [];
      }

      // remove previous sketches
      if (PREVSLIDE != null) {
        let canvases = DECKS[CURRENTDECK - 1].canvases[PREVSLIDE - 1];
        console.log('I will remove ' + canvases.length + ' canvases')
        for (let c = 0; c < canvases.length; c++) {
          DECKS[CURRENTDECK - 1].canvases[PREVSLIDE - 1][c].remove();
        }
        DECKS[CURRENTDECK - 1].canvases[PREVSLIDE - 1] = [];
      }

        let sketchesForSlide = DECKS[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1];

        // initialize sketch canvases
        if (DECKS[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].length == 0 && sketchesForSlide.length > 0) {

          // place new sketches

          let p = DECKS[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].length;

          console.log('I will add ' +sketchesForSlide.length + ' canvases')

          X_BOUNDS = [];
          Y_BOUNDS[0] += MARGINS/2;
          Y_BOUNDS[1] -= MARGINS/2;
          let c;
          let r;
          let y_i;
          let x_shift = 0;

          if (p > 3) {
            c = floor(p / sqrt(p));
            r = ceil(p / sqrt(p));
            y_i = Y_BOUNDS[1] / r;
            Y_BOUNDS[1] = y_i;
          }

          for (let i = 0; i < p; i++) {

            if (x_shift == c) {
              Y_BOUNDS[0] += y_i;
              Y_BOUNDS[1] += y_i;
              x_shift = 0;
            }

// This is messy...
            if (p <= 3) {
              if (EDITSIDEBAR.style('display') == 'block') {
                X_BOUNDS = [SIDEBAR_SIZEX + ((x_shift) * (MAIN_CANVAS.width / p)), SIDEBAR_SIZEX + ((x_shift + 1) * (MAIN_CANVAS.width / p))];
              } else {
                X_BOUNDS = [((x_shift) * (MAIN_CANVAS.width / p)), ((x_shift + 1) * (MAIN_CANVAS.width / p))];
              }
            } else if(p > 3) {

                if (EDITSIDEBAR.style('display') == 'block') {
                  X_BOUNDS = [SIDEBAR_SIZEX + ((x_shift) * (MAIN_CANVAS.width / c)), SIDEBAR_SIZEX + ((x_shift + 1) * (MAIN_CANVAS.width / c))];
                } else {
                  X_BOUNDS = [((x_shift) * (MAIN_CANVAS.width / c)), ((x_shift + 1) * (MAIN_CANVAS.width / c))];
                }
              }

            temp_ = new p5(sketchesForSlide[i]);

            // properly size sketches
            CANVAS_TRANSPORTER.id('c' + (CANVAS_COUNTER + (i+1)));
            DECKS[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].push(CANVAS_TRANSPORTER);

            CANVAS_TRANSPORTER = null;
            x_shift ++;
          }
          CANVAS_COUNTER += p;
        } else {

          let canvases = DECKS[CURRENTDECK - 1].canvases[CURRENTSLIDE-1];
          console.log('I will show ' + canvases.length + ' canvases')
          for (let i = 0; i < canvases.length; i++) {
            canvases[i].show();
          }
      }
      TOGGLED = false;
      PREVKEY = "";
  }


    // show slide number
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    text(CURRENTSLIDE + '/' + DECKS[CURRENTDECK-1].deckLength,width,height);

  }
}




// SLIDE DECK OBJECT


p5.slideDeck = function(name) {

  TOGGLED = true;
  MARGINS = width / 24;
  PREVKEY = "";
  Y_BOUNDS = [];
  X_BOUNDS = [];

  this.name = name;
  this.sketches = []; // initialize the sketch array
  this.deckLength = 0;
  this.templates = [];
  this.headings = [];
  this.subheadings = [];
  CURRENTSLIDE = 1;
  PREVSLIDE = null;
  this.canvases = [];
  this.xBounds = [];
  this.bColors = [];
  this.colorOptions = [color(0,0,0), color(288,288,288)];
};

// TEMPLATE CHARACTERISTICS
function slideTemplates(template, header, subheading, textColor) {

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
    Y_BOUNDS = [0,height];
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


    Y_BOUNDS = [0, height - subSize - headerSize];

  }

}





// CREATE SLIDE ELEMENTS
p5.slideDeck.prototype.addSlides = function(num) {
  // add new slide to SlideDeck object

  for (let i = 0; i < num; i++) {

    // define template creation order
    if (this.deckLength == 1){
      this.sketches[this.deckLength + (i)] = [perlinRect]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'low-header';
      this.headings[this.deckLength + (i)] = 'Showcase Mode';
      this.subheadings[this.deckLength + (i)] = 'Show off a single sketch';
    } else if (this.deckLength == 0) {
      this.sketches[this.deckLength + (i)] = [perlinRect]; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'full-text';
      this.headings[this.deckLength + (i)] = 'P5.SLIDES,INTERACTIVE PRESENTATIONS FOR THE WEB';
      this.subheadings[this.deckLength + (i)] = '';
    } else if (this.deckLength > 2) {
        this.sketches[this.deckLength + (i)] = [];
        this.templates[this.deckLength + (i)] = 'full-sketch';
        this.headings[this.deckLength + (i)] = '';
        this.subheadings[this.deckLength + (i)] = '';
    } else if (this.deckLength == 2) {
      this.sketches[this.deckLength + (i)] = [perlinRect,perlinCircle,perlinRect,perlinCircle];
      this.templates[this.deckLength + (i)] = 'low-header';
      this.headings[this.deckLength + (i)] = 'Panel Mode';
      this.subheadings[this.deckLength + (i)] = 'Expand your visual repertoire';
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



p5.slideDeck.prototype.setMargins = function(marginSize) {
  // assign margin sizes to slides in SlideDeck object

  MARGINS = marginSize;
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
  this.style('color','white');
}

// Button Functionality
function TEXTEDITBUTTONS_ADD() {

  console.log('editing!')

  let b_height = this.height/4;
  // move text
  MOVE_TEXT.size(b_height,b_height);
  MOVE_TEXT.position(this.x, this.y-b_height);
  MOVE_TEXT.show();

  // color text
  COLOR_TEXT.position(this.x+b_height, this.y);
  COLOR_TEXT.size(b_height,b_height);
  COLOR_TEXT.show();

  // scale text (box)
  SCALE_TEXT.position(this.x+2*b_height,this.y-b_height);
  SCALE_TEXT.size(b_height,b_height);
  SCALE_TEXT.show();

  // animate text
  ANIMATE_TEXT.position(this.x+3*b_height,this.y-b_height);
  ANIMATE_TEXT.size(v,b_height);
  ANIMATE_TEXT.show();
}

function TEXTEDITBUTTONS_REMOVE() {

  console.log('editing!')
  // move text
  MOVE_TEXT.hide();

  // color text
  COLOR_TEXT.hide();

  // scale text (box)
  SCALE_TEXT.hide();

  // animate text
  ANIMATE_TEXT.hide();
}

function OFF() {
  this.style('background-color','transparent');
  this.style('opacity','1');
  this.style('color', 'transparent')
}


function TEXT_HEADER() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'header';
}

function TEXT_SUBHEADER() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'subheader';
}

function TEXT_BODY() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'body';
}

function SKETCH_PLACEMENT() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'sketch';
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

  // create sketches into the canvas
  ADDSKETCH_BUTTON = createButton('Draw Sketches');
  ADDSKETCH_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  ADDSKETCH_BUTTON.parent('sidebar');
  styleButton(ADDSKETCH_BUTTON);

  // create save button
  SAVE_BUTTON = createButton('Save Slides');
  SAVE_BUTTON.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
  SAVE_BUTTON.parent('sidebar');
  styleButton(SAVE_BUTTON);


  // create button to move text
  MOVE_TEXT = createButton('M');
  MOVE_TEXT.size(SIDEBAR_SIZEY,SIDEBAR_SIZEY);
  MOVE_TEXT.hide();
  styleButton(MOVE_TEXT);

  // create button to color text
  COLOR_TEXT = createButton('C');
  COLOR_TEXT.size(SIDEBAR_SIZEY,SIDEBAR_SIZEY);
  COLOR_TEXT.hide();
  styleButton(COLOR_TEXT);

  // create button to scale text (box)
  SCALE_TEXT = createButton('S');
  SCALE_TEXT.size(SIDEBAR_SIZEY,SIDEBAR_SIZEY);
  SCALE_TEXT.hide();
  styleButton(SCALE_TEXT);

  // create button to animate text
  ANIMATE_TEXT = createButton('A');
  ANIMATE_TEXT.size(SIDEBAR_SIZEY,SIDEBAR_SIZEY);
  ANIMATE_TEXT.hide();
  styleButton(ANIMATE_TEXT);


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
    if (TRACKED_TOUCHES == 'onstart') {
      TRACKED_TOUCHES = [mouseX,mouseY];
      console.log('touch started');
      console.log(TRACKED_TOUCHES);
    }
}

function touchEnded() {
  if (TRACKED_TOUCHES == 'waituntilended') {
    TRACKED_TOUCHES = 'onstart';
    console.log('waiting');
  } else if (TRACKED_TOUCHES.length == 2) {
    console.log('drawing');
    TRACKED_TOUCHES.push(mouseX, mouseY);
    drawFromTouch();
    TRACKED_TOUCHES = '';
  }
}

function drawFromTouch() {
  let field = null;
  switch (DRAW_FROM_TOUCH) {
    case 'header':
      field = createInput('Your header here');
      field.position(SIDEBAR_SIZEX + TRACKED_TOUCHES[0], TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      TRACKED_TOUCHES = '';
      CREATED_TEXT[0].push(field);
      break;

    case 'subheader':
      field = createInput('Your subheader here');
      field.position(SIDEBAR_SIZEX + TRACKED_TOUCHES[0], TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "grey");
      field.style("border", "none");
      TRACKED_TOUCHES = '';
      CREATED_TEXT[1].push(field);
      break;


    case 'body':
      field = createInput('Your body text here');
      field.position(SIDEBAR_SIZEX + TRACKED_TOUCHES[0], TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      TRACKED_TOUCHES = '';
      CREATED_TEXT[2].push(field);
      break;


    case 'sketch':
      let sketch_to_add = KaleidoParticles;

      // properly size sketches
      X_BOUNDS = [SIDEBAR_SIZEX + TRACKED_TOUCHES[0], SIDEBAR_SIZEX +TRACKED_TOUCHES[2]];
      Y_BOUNDS = [TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]];
      let temp_ = new p5(sketch_to_add);
      CANVAS_TRANSPORTER.id('c' + (CANVAS_COUNTER + (1)));
      DECKS[CURRENTDECK-1].canvases[CURRENTSLIDE - 1].push(CANVAS_TRANSPORTER);
      DECKS[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].push(KaleidoParticles)

      CANVAS_TRANSPORTER = null;
      CANVAS_COUNTER += 1;
      break;

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
console.log(CREATED_TEXT[i][j].value());
        CREATED_TEXT[i][j].style("font-size", font + "px");

        CREATED_TEXT[i][j].mouseOver(TEXTEDITBUTTONS_ADD);
        CREATED_TEXT[i][j].mouseOut(TEXTEDITBUTTONS_REMOVE);

      }
    }
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