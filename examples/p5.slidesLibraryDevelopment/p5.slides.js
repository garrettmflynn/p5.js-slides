
/* PS.SLIDES
   Written by Garrett Flynn | November 2019

*/


// UI Object
p5.slidesUI = function(savedDecks) {
  this.decks = [];
  // load old decks if available, or create a new deck
  if (savedDecks === undefined) {
    //this.decks.push(new p5.slideDeck('Intro to P5.Slides'));
  } else {
    for (let i = 0; i < savedDecks.length; i++) {
      this.decks[i] = this.loadData(savedDecks);
    }
  }

  MAIN_CANVAS = createCanvas(windowWidth, windowHeight);

  this.margins = width / 24;

  CANVAS_TRANSPORTER = null;
  TOGGLED = false;
  TRACKED_TOUCHES = '';
  DRAW_FROM_TOUCH = '';
  this.created_text = [];
  this.created_text[0] = []; // header cache
  this.created_text[1] = []; // subheader cache
  this.created_text[2] = []; // body text cache
  REVISION_TOGGLE = true;
  this.currentDeck = 1;
  NEWOBJS_ = null;
  CANVAS_COUNTER = 0;
  DRAWNOW = false;

  this.sidebar_y = height/10;
  this.sidebar_x = width/6;
  SIDEBAR_SIZEX = 0;
  NUMDECKS = this.decks.length;
  MAXSLIDE = 1;


  this.createSidebar();
  TO_EDITMODE()
}


p5.slidesUI.prototype.createSidebar = function(){
  // Create Sidebar
  EDITSIDEBAR = createDiv();
  EDITSIDEBAR.id("sidebar");
  EDITSIDEBAR.size(this.sidebar_x,height);
  EDITSIDEBAR.position(0,0);
  EDITSIDEBAR.style("background-color",color(20));

// create "edit mode" button
  EDIT_BUTTON = createButton('Edit Mode');
  EDIT_BUTTON.position(0, 0);
  EDIT_BUTTON.size(this.sidebar_x,this.sidebar_y);
  styleButton(EDIT_BUTTON);
  EDIT_BUTTON.hide();
  EDIT_BUTTON.mousePressed(TO_EDITMODE);
  EDIT_BUTTON.mouseOver(ON_HOVER);
  EDIT_BUTTON.mouseOut(OFF);

// create "present mode" button
  PRESENT_BUTTON = createButton('Present Mode');
  PRESENT_BUTTON.parent("sidebar");
  PRESENT_BUTTON.size(this.sidebar_x,this.sidebar_y);
  styleButton(PRESENT_BUTTON);
  PRESENT_BUTTON.mousePressed(TO_PRESENTMODE);

  // create new deck button
  NEWDECK_BUTTON = createButton('Add Deck');
  NEWDECK_BUTTON.size(this.sidebar_x,this.sidebar_y);
  NEWDECK_BUTTON.parent('sidebar');
  styleButton(NEWDECK_BUTTON);
  NEWDECK_BUTTON.mousePressed(NEWDECK);

  // create add slides button
  ADDSLIDE_BUTTON = createButton('Add Slide');
  ADDSLIDE_BUTTON.size(this.sidebar_x,this.sidebar_y);
  ADDSLIDE_BUTTON.parent('sidebar');
  styleButton(ADDSLIDE_BUTTON);
  ADDSLIDE_BUTTON.mousePressed(ADDSLIDE);

// create header button
  HEADER_BUTTON = createButton('Header');
  HEADER_BUTTON.size(this.sidebar_x,this.sidebar_y/3);
  HEADER_BUTTON.parent('sidebar');
  styleButton(HEADER_BUTTON);
  HEADER_BUTTON.style('text-transform', 'uppercase');
  HEADER_BUTTON.style('font-weight', 'bold');
  HEADER_BUTTON.mousePressed(TEXT_HEADER);

  // create subheader button
  SUBHEADER_BUTTON = createButton('Subheader');
  SUBHEADER_BUTTON.size(this.sidebar_x,this.sidebar_y/3);
  SUBHEADER_BUTTON.parent('sidebar');
  styleButton(SUBHEADER_BUTTON);
  SUBHEADER_BUTTON.style('font-style', 'italic');
  SUBHEADER_BUTTON.mousePressed(TEXT_SUBHEADER);

  // create body button
  BODYTEXT_BUTTON = createButton('Body Text');
  BODYTEXT_BUTTON.size(this.sidebar_x,this.sidebar_y/3);
  BODYTEXT_BUTTON.parent('sidebar');
  styleButton(BODYTEXT_BUTTON);
  BODYTEXT_BUTTON.mousePressed(TEXT_BODY);

  // create sketches into the canvas
  ADDSKETCH_BUTTON = createButton('Draw Sketches');
  ADDSKETCH_BUTTON.size(this.sidebar_x,this.sidebar_y);
  ADDSKETCH_BUTTON.parent('sidebar');
  styleButton(ADDSKETCH_BUTTON);
  ADDSKETCH_BUTTON.mousePressed(SKETCH_PLACEMENT);

  // create save button
  SAVE_BUTTON = createButton('Save Slides');
  SAVE_BUTTON.size(this.sidebar_x,this.sidebar_y);
  SAVE_BUTTON.parent('sidebar');
  styleButton(SAVE_BUTTON);
  SAVE_BUTTON.mousePressed(SAVE_SLIDES);


  // create button to move text
  MOVE_TEXT = createButton('M');
  MOVE_TEXT.size(this.sidebar_y,this.sidebar_y);
  MOVE_TEXT.hide();
  styleButton(MOVE_TEXT);

  // create button to color text
  COLOR_TEXT = createButton('C');
  COLOR_TEXT.size(this.sidebar_y,this.sidebar_y);
  COLOR_TEXT.hide();
  styleButton(COLOR_TEXT);

  // create button to scale text (box)
  SCALE_TEXT = createButton('S');
  SCALE_TEXT.size(this.sidebar_y,this.sidebar_y);
  SCALE_TEXT.hide();
  styleButton(SCALE_TEXT);

  // create button to animate text
  ANIMATE_TEXT = createButton('A');
  ANIMATE_TEXT.size(this.sidebar_y,this.sidebar_y);
  ANIMATE_TEXT.hide();
  styleButton(ANIMATE_TEXT);

  DECK_TABS = [];
}

// Interaction Checker
p5.slidesUI.prototype.checkInteraction = function(){

  if (TRACKED_TOUCHES.length == 2){
    noFill();
    stroke('white');
    rect(TRACKED_TOUCHES[0],TRACKED_TOUCHES[1],mouseX-TRACKED_TOUCHES[0],mouseY-TRACKED_TOUCHES[1]);
  }

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

  if ((this.decks.length) > 0) {
  NUMDECKS = this.decks.length;
  CURRENTDECK = this.currentDeck;
  MAXSLIDE = this.decks[this.currentDeck-1].length - 1;
}

  SIZEBAR_SIZEX = this.sidebar_x;

  // Draw Text Now
  if (DRAWNOW) {
  this.drawFromTouch();
  TRACKED_TOUCHES = '';
  DRAWNOW = false;
  }


  if (this.decks.length != 0) {

      // Does this work?
      this.textResizer();

    // add slides to existing decks if necessary
    if (REVISION_TOGGLE || this.decks[this.currentDeck - 1].deckLength == 0) {
      this.decks[this.currentDeck - 1].addSlides(1);
      REVISION_TOGGLE = null;
    }


    //define complementary colors for background and text
    background(color(0, 0, 0));

    if (TOGGLED == true) {
      this.slideTemplates();

      // initialize empty canvas holders
      if (this.decks[this.currentDeck - 1].canvases[CURRENTSLIDE-1] === undefined) {
        this.decks[this.currentDeck - 1].canvases[CURRENTSLIDE-1] = [];
      }

      // remove previous sketches
      if (PREVSLIDE != null) {
        let canvases = this.decks[this.currentDeck - 1].canvases[PREVSLIDE - 1];
        for (let c = 0; c < canvases.length; c++) {
          this.decks[this.currentDeck - 1].canvases[PREVSLIDE - 1][c].remove();
        }
        this.decks[this.currentDeck - 1].canvases[PREVSLIDE - 1] = [];
      }

        let sketchesForSlide = this.decks[this.currentDeck - 1].sketches[CURRENTSLIDE - 1];
        // initialize sketch canvases
        if (this.decks[this.currentDeck - 1].canvases[CURRENTSLIDE-1].length == 0 && sketchesForSlide.length > 0) {


          // place new sketches

          let p = this.decks[this.currentDeck - 1].sketches[CURRENTSLIDE - 1].length;

          X_BOUNDS = [];
          Y_BOUNDS[0] += this.margins/2;
          Y_BOUNDS[1] -= this.margins/2;
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
                X_BOUNDS = [this.sidebar_x + ((x_shift) * (MAIN_CANVAS.width / p)), this.sidebar_x + ((x_shift + 1) * (MAIN_CANVAS.width / p))];
              } else {
                X_BOUNDS = [((x_shift) * (MAIN_CANVAS.width / p)), ((x_shift + 1) * (MAIN_CANVAS.width / p))];
              }
            } else if(p > 3) {

                if (EDITSIDEBAR.style('display') == 'block') {
                  X_BOUNDS = [this.sidebar_x + ((x_shift) * (MAIN_CANVAS.width / c)), this.sidebar_x + ((x_shift + 1) * (MAIN_CANVAS.width / c))];
                } else {
                  X_BOUNDS = [((x_shift) * (MAIN_CANVAS.width / c)), ((x_shift + 1) * (MAIN_CANVAS.width / c))];
                }
              }

            temp_ = new p5(sketchesForSlide[i]);

            // properly size sketches
            CANVAS_TRANSPORTER.id('c' + (CANVAS_COUNTER + (i+1)));
            this.decks[this.currentDeck - 1].canvases[CURRENTSLIDE-1].push(CANVAS_TRANSPORTER);

            CANVAS_TRANSPORTER = null;
            x_shift ++;
          }
          CANVAS_COUNTER += p;
        // } else {
        //
        //   let canvases = this.decks[this.currentDeck - 1].canvases[CURRENTSLIDE-1];
        //   for (let i = 0; i < canvases.length; i++) {
        //     canvases[i].show();
        //   }
      }
      TOGGLED = false;
      PREVKEY = "";
  }


    // show slide number
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    text(CURRENTSLIDE + '/' + this.decks[this.currentDeck-1].deckLength,width,height);

  }
}




// SLIDE DECK OBJECT


p5.slideDeck = function(name) {

  TOGGLED = true;
  this.margins = width / 24;
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
p5.slidesUI.prototype.slideTemplates = function() {


  let template = this.decks[this.currentDeck - 1].templates[CURRENTSLIDE - 1];
  let header = this.decks[this.currentDeck - 1].headings[CURRENTSLIDE - 1];
  let subheader = this.decks[this.currentDeck - 1].subheadings[CURRENTSLIDE - 1];
  let textColor = color(0,0,0);

  // Determine header length for automatic sizing
  if (template == 'full-text') {

    let H = createInput(header);
    H.size(MAIN_CANVAS.width-2*this.margins-this.sidebar_x,(2*height/3)-this.margins);
    H.position(this.sidebar_x+this.margins,this.margins);
    H.style('background-color','transparent');
    H.style('color','white');
    H.style('text-transform', 'uppercase');
    H.style('font-weight', 'bold');

    // let size = int(H.style("font-size"));
    // let ratio = 0;
    // let inc = 10;
    // let prevRatio = 0;
    //
    // while (ratio < .9 || ratio > 1){
    //   if (ratio < .9 && prevRatio > 1) {
    //     size -= inc;
    //     inc *= -1;
    //   }
    //   else if (ratio > 1 && prevRatio < .9){
    //     inc *= -.1;
    //   }
    //
    //   size += inc;
    //
    //   textSize(size);
    //   ratio = textWidth(header)/width;
    //   console.log(textWidth(header));
    // }
    // H.style("font-size", size + 'px');
    // console.log('Out of header');


    let S = createInput(subheader);
    S.size(MAIN_CANVAS.width-2*this.margins-this.sidebar_x,(height/3)-this.margins);
    S.position(this.sidebar_x+this.margins, 2*height/3 + this.margins/2);
    S.style('background-color','transparent');
    S.style('color','white');
    S.style('font-style', 'italic');

    size = int(S.style("font-size"));

    ratio = 0;

    // while (ratio < .9 || ratio > 1){
    //   if (ratio < .9) {
    //     size += 1;
    //   }
    //   else if (ratio > 1){
    //     size -= .1;
    //   }
    //   textSize(size);
    //   ratio = textWidth(subheader)/width;
    //   console.log(ratio);
    // }
    // console.log('Out of subheader');
    // S.style("font-size", size + 'px');
  }

  if (template == 'full-sketch') {
    Y_BOUNDS = [0,height];
  }



  if (template == 'mid-title') {
    let headerSize = 1.5 * (width - 2 * this.margins) / (headerLength);
    textColor.setAlpha(100);
    fill(textColor);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    textSize(headerSize / 2);
    text(subheader, this.margins, (height / 2 + this.margins / 2));


    textColor.setAlpha(255);
    fill(textColor);
    textAlign(LEFT, BOTTOM);
    textStyle(BOLD);
    textSize(headerSize);
    let headerStart = (height / 2 - this.margins / 2);
    text(header, this.margins, headerStart);

  }

  if (template == 'low-header') {
    let headerSize = 1.5 * (width - 2 * this.margins) / (2 * header.length);

    textColor.setAlpha(100);
    fill(textColor);
    textStyle(ITALIC);
    textAlign(LEFT, BOTTOM);
    textSize(headerSize / 2);
    text(subheader, this.margins, (height - this.margins));


    textColor.setAlpha(255);
    fill(textColor);
    textAlign(LEFT, BOTTOM);
    textStyle(BOLD);
    textSize(headerSize);
    let subSize = this.margins + headerSize;
    let headerStart = (height - subSize);
    text(header, this.margins, headerStart);


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
      this.sketches[this.deckLength + (i)] = []; //[blankSketch]; //
      this.templates[this.deckLength + (i)] = 'full-text';
      this.headings[this.deckLength + (i)] = 'P5.SLIDES';
      this.subheadings[this.deckLength + (i)] = 'INTERACTIVE PRESENTATIONS FOR THE WEB';
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
  this.margins = marginSize;
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



function NEWDECK() {
  if (NUMDECKS == 0){
    TOGGLE = true;
  }
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
    DECK_TABS[i].size(tabWidth,this.sidebar_y);
    DECK_TABS[i].position(tabWidth*(i),windowHeight);
    DECK_TABS[i].show;
  }
}


function touchStarted(){
    if (TRACKED_TOUCHES == 'onstart') {
      TRACKED_TOUCHES = [mouseX,mouseY];
    }
}

function touchEnded() {
  if (TRACKED_TOUCHES == 'waituntilended') {
    TRACKED_TOUCHES = 'onstart';
  } else if (TRACKED_TOUCHES.length == 2) {
    TRACKED_TOUCHES.push(mouseX, mouseY);
    DRAWNOW = true;
  }
}

p5.slidesUI.prototype.drawFromTouch = function() {
  let field = null;
  switch (DRAW_FROM_TOUCH) {
    case 'header':
      field = createInput('Your header here');
      field.position(this.sidebar_x + TRACKED_TOUCHES[0],TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      field.style('text-transform', 'uppercase');
      field.style('font-weight', 'bold');
      TRACKED_TOUCHES = '';
      this.created_text[0].push(field);
      break;

    case 'subheader':
      field = createInput('Your subheader here');
      field.position(this.sidebar_x + TRACKED_TOUCHES[0], TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "grey");
      field.style("border", "none");
      field.style('font-style', 'italic');
      TRACKED_TOUCHES = '';
      this.created_text[1].push(field);
      break;


    case 'body':
      field = createInput('Your body text here');
      field.position(this.sidebar_x + TRACKED_TOUCHES[0], TRACKED_TOUCHES[1]);
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      TRACKED_TOUCHES = '';
      this.created_text[2].push(field);
      break;


    case 'sketch':
      let sketch_to_add = KaleidoParticles;

      // properly size sketches
      X_BOUNDS = [this.sidebar_x + TRACKED_TOUCHES[0], this.sidebar_x +TRACKED_TOUCHES[2]];
      Y_BOUNDS = [TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]];
      let temp_ = new p5(sketch_to_add);
      CANVAS_TRANSPORTER.id('c' + (CANVAS_COUNTER + (1)));
      this.decks[this.currentDeck-1].canvases[CURRENTSLIDE - 1].push(CANVAS_TRANSPORTER);
      this.decks[this.currentDeck - 1].sketches[CURRENTSLIDE - 1].push(KaleidoParticles)

      CANVAS_TRANSPORTER = null;
      CANVAS_COUNTER += 1;
      break;

  }
}


p5.slidesUI.prototype.textResizer = function() {

  for (let i = 0; i < this.created_text.length; i++) {
    for (let j = 0; j < this.created_text[i].length; j++) {
      let font = 0;
      if (i == 0) {
        font = width / 10;
      } else if (i == 1) {
        font = width / 20;
      } else {
        font = width / 30;
      }

      this.created_text[i][j].style("font-size", font + "px");

      // CREATED_TEXT[i][j].mouseOver(TEXTEDITBUTTONS_ADD);
      // CREATED_TEXT[i][j].mouseOut(TEXTEDITBUTTONS_REMOVE);

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