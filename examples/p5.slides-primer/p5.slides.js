
/* PS.SLIDES
   Written by Garrett Flynn | November 2019

*/


// UI Object
p5.slidesUI = function(savedDecks,sketchesToLoad) {
  this.decks = [];
  this.loadedSketches = [];

  // load supplied sketches
  keys = Object.keys(sketchesToLoad);
  for (let i = 0; i < keys.length; i++){
     this.loadedSketches.push([keys[i],sketchesToLoad[keys[i]]]);
   }

  this.allGlobalVariables(1);
  this.sidebar_y = height/20;
  this.sidebar_x = width/6;

  // load old decks if available, or create a new deck
  if (savedDecks === undefined || savedDecks.length == 0) {
    this.margins = width/24;
    this.allGlobalVariables(2);
    this.createSidebars();

    this.decks.push(new p5.slideDeck('Intro to P5.Slides'));

    // add template slides
    let slides_to_create = 4;
    this.decks[CURRENTDECK - 1].addSlides(slides_to_create);

    // create first deck tab
    this.showDeckTabs(this.decks);
  } else {
    for (let i = 0; i < Object.keys(savedDecks).length; i++) {
      this.unpackJSON(savedDecks);
      this.allGlobalVariables(2);
      this.createSidebars();
    }
  }

  this.allGlobalVariables(3);
}

p5.slidesUI.prototype.allGlobalVariables = function(set){



  if (set == 1) {
    MAIN_CANVAS = createCanvas(windowWidth, windowHeight);
    TRACKED_TOUCHES = '';
    if (this.margins !== undefined) {
      MARGINS = this.margins;
    } else {
      MARGINS = null;
    }
  } else if (set == 2) {
    if (this.margins !== undefined) {
      MARGINS = this.margins;
    }
    CANVAS_TRANSPORTER = null;
    TOGGLED = true;
    TOGGLE_SAVE = false;
    DRAW_FROM_TOUCH = '';
    REVISION_TOGGLE = false;
    CURRENTDECK = 1;
    CURRENTSLIDE = 1;
    PREVSLIDE = null;
    PREVKEY = "";
    Y_BOUNDS = [];
    X_BOUNDS = [];
    CHOSEN_SKETCH = null;
    NEWOBJS_ = null;
    DRAWNOW = false;

    SIDEBAR_SIZEY = this.sidebar_y;
    SIDEBAR_SIZEX = this.sidebar_x;
  } else if (set == 3){
    NUMDECKS = this.decks.length;
    MAXSLIDE = this.decks[CURRENTDECK-1].deckLength;
    LOGGED_SIZES = [];
  }
}


p5.slidesUI.prototype.createSidebars = function(){
  // Create Sidebars
  SIDEBAR = createDiv();
  SIDEBAR.id("sidebar");
  SIDEBAR.size(SIDEBAR_SIZEX,height);
  SIDEBAR.position(0,0);
  SIDEBAR.style("background-color",color(20));
  SIDEBAR.style('z-index', 10);

      // resize main canvas
      MAIN_CANVAS.size(windowWidth-SIDEBAR_SIZEX,height);
      MAIN_CANVAS.position(SIDEBAR_SIZEX,0);

  EDITSIDEBAR = createDiv();
  EDITSIDEBAR.id("editbar");
  EDITSIDEBAR.parent("sidebar");
  EDITSIDEBAR.size(SIDEBAR_SIZEX,height);
  EDITSIDEBAR.position(0,0);
  EDITSIDEBAR.style("background-color",color(20));
  EDITSIDEBAR.style('z-index', 10);

  SKETCHBAR = createDiv();
  SKETCHBAR.id("sketchbar");
  SKETCHBAR.parent("sidebar");
  SKETCHBAR.size(SIDEBAR_SIZEX,height);
  SKETCHBAR.position(0,0);
  SKETCHBAR.style("background-color",color(20));
  SKETCHBAR.style('z-index', 10);
  SKETCHBAR.hide();

  TEXTBAR1 = createDiv();
  TEXTBAR1.id("textbar1");
  TEXTBAR1.parent("sidebar");
  TEXTBAR1.size(SIDEBAR_SIZEX,height);
  TEXTBAR1.position(0,0);
  TEXTBAR1.style("background-color",color(20));
  TEXTBAR1.style('z-index', 10);
  TEXTBAR1.hide();

  TEXTBAR2 = createDiv();
  TEXTBAR2.id("textbar2");
  TEXTBAR2.parent("sidebar");
  TEXTBAR2.size(SIDEBAR_SIZEX,height);
  TEXTBAR2.position(0,0);
  TEXTBAR2.style("background-color",color(20));
  TEXTBAR2.style('z-index', 10);
  TEXTBAR2.hide();

  DECKBAR = createDiv();
  DECKBAR.id("deckbar");
  DECKBAR.parent("sidebar");
  DECKBAR.size(SIDEBAR_SIZEX,height);
  DECKBAR.position(0,0);
  DECKBAR.style("background-color",color(20));
  DECKBAR.style('z-index', 10);
  DECKBAR.hide();

  SHAPEBAR = createDiv();
  SHAPEBAR.id("shapebar");
  SHAPEBAR.parent("sidebar");
  SHAPEBAR.size(SIDEBAR_SIZEX,height);
  SHAPEBAR.position(0,0);
  SHAPEBAR.style("background-color",color(20));
  SHAPEBAR.style('z-index', 10);
  SHAPEBAR.hide();

// create "edit mode" button
  EDIT_BUTTON = createImg('icons/edit-document.png');
  EDIT_BUTTON.position(0, 0);
  EDIT_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  EDIT_BUTTON.style('z-index', 11);
  EDIT_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  EDIT_BUTTON.hide();
  EDIT_BUTTON.mousePressed(this.editMode);
  EDIT_BUTTON.mouseOver(ON_HOVER);
  EDIT_BUTTON.mouseOut(OFF);

// create "present mode" button
  PRESENT_BUTTON = createImg('icons/monitor.png');
  PRESENT_BUTTON.parent("editbar");
  PRESENT_BUTTON.size(SIDEBAR_SIZEX/3,SIDEBAR_SIZEX/3);
  PRESENT_BUTTON.style('padding-left',SIDEBAR_SIZEX/3 + 'px');
  PRESENT_BUTTON.style('padding-right',SIDEBAR_SIZEX/3 + 'px');
  styleButton(PRESENT_BUTTON);
  PRESENT_BUTTON.mousePressed(this.presentMode);

  // create new deck button
  VIEWDECKS_BUTTON = createImg('icons/slideshow-line.png');
  VIEWDECKS_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  VIEWDECKS_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  VIEWDECKS_BUTTON.parent('editbar')
  VIEWDECKS_BUTTON.style('position','absolute');
  VIEWDECKS_BUTTON.style('left','0');
  VIEWDECKS_BUTTON.style('bottom','0');
  VIEWDECKS_BUTTON.style("background-color",'#7e42f5');
  VIEWDECKS_BUTTON.style("color","#ffffff");
  VIEWDECKS_BUTTON.style("border","none");
  VIEWDECKS_BUTTON.mousePressed(TOGGLE_DECKBAR);

  NEWDECK_BUTTON = createImg('icons/text-document-add.png');
  NEWDECK_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  NEWDECK_BUTTON.parent('deckbar');
  NEWDECK_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  NEWDECK_BUTTON.style('position','absolute');
  NEWDECK_BUTTON.style('left','0');
  NEWDECK_BUTTON.style('bottom','0');
  styleButton(NEWDECK_BUTTON);
  NEWDECK_BUTTON.mousePressed(NEWDECK);

  // create add slides button
  ADDSLIDE_BUTTON = createImg('icons/plus-round-line.png');
  ADDSLIDE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  ADDSLIDE_BUTTON.parent('editbar');
  ADDSLIDE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  ADDSLIDE_BUTTON.style('position','absolute');
  ADDSLIDE_BUTTON.style('left',str((SIDEBAR_SIZEX/3)) + 'px');
  ADDSLIDE_BUTTON.style('bottom','0');
  styleButton(ADDSLIDE_BUTTON);
  ADDSLIDE_BUTTON.mousePressed(ADDSLIDE);

  // create button to add text to your slides
  TEXT_BUTTON = createImg('icons/font.png');
  TEXT_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  TEXT_BUTTON.parent('editbar');
  TEXT_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  styleButton(TEXT_BUTTON);
  TEXT_BUTTON.mousePressed(TOGGLE_TEXTBAR1);

  // create button to add text to your slides
  SHAPE_BUTTON = createImg('icons/circle.png');
  SHAPE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  SHAPE_BUTTON.parent('editbar');
  SHAPE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  styleButton(SHAPE_BUTTON);
  SHAPE_BUTTON.mousePressed(TOGGLE_SHAPEBAR);

// create & display text types

  // header text
  TEXT_TYPES = [];
  TEXT_TYPES[0] = createButton('Header');
  TEXT_TYPES[0].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[0].parent('textbar1');
  styleButton(TEXT_TYPES[0]);
  TEXT_TYPES[0].style('text-transform', 'uppercase');
  TEXT_TYPES[0].style('font-weight', 'bold');
  TEXT_TYPES[0].mousePressed(TEXT_HEADER);

  // subheader text
  TEXT_TYPES[1] = createButton('Subheader');
  TEXT_TYPES[1].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[1].parent('textbar1');
  styleButton(TEXT_TYPES[1]);
  TEXT_TYPES[1].style('font-style', 'italic');
  TEXT_TYPES[1].mousePressed(TEXT_SUBHEADER);

  // body text
  TEXT_TYPES[2] = createButton('Body Text');
  TEXT_TYPES[2].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[2].parent('textbar1');
  styleButton(TEXT_TYPES[2]);
  TEXT_TYPES[2].mousePressed(TEXT_BODY);

  // buttons to place sketches into the canvas
  ADDSKETCH_BUTTON = createImg('icons/spark.png');
  ADDSKETCH_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  ADDSKETCH_BUTTON.parent('editbar');
  ADDSKETCH_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  styleButton(ADDSKETCH_BUTTON);
  ADDSKETCH_BUTTON.mousePressed(TOGGLE_SKETCHBAR);


  // create tabs to signify loaded sketch URLs
  SKETCH_TABS = [];
  for (let s = 0; s < this.loadedSketches.length; s++) {
    SKETCH_TABS[s] = createButton(this.loadedSketches[s][0]);
    SKETCH_TABS[s].attribute('url', this.loadedSketches[s][1]);
    SKETCH_TABS[s].id('sketchtab' + s);
    styleButton(SKETCH_TABS[s]);
    SKETCH_TABS[s].mousePressed(SKETCH_CHOSEN);
    SKETCH_TABS[s].size(SIDEBAR_SIZEX, SIDEBAR_SIZEY);
    SKETCH_TABS[s].parent('sketchbar');
  }

  DRAW_BUTTON = createButton('Draw Now');
  DRAW_BUTTON.parent('sketchbar');
  DRAW_BUTTON.size(SIDEBAR_SIZEX-2*SIDEBAR_SIZEY, SIDEBAR_SIZEY);
  DRAW_BUTTON.style('position','absolute');
  DRAW_BUTTON.style('left','0');
  DRAW_BUTTON.style('bottom',str(SIDEBAR_SIZEY) + 'px');
  DRAW_BUTTON.style("background-color",'#fca103');
  DRAW_BUTTON.style("color","#ffffff");
  DRAW_BUTTON.style("border","none");
  DRAW_BUTTON.mousePressed(SKETCH_PLACEMENT);

  URL_INPUT = createInput('URL');
  URL_INPUT.id('url_input')
  URL_INPUT.parent('sketchbar');
  URL_INPUT.size(SIDEBAR_SIZEX-2*SIDEBAR_SIZEY, SIDEBAR_SIZEY);
  URL_INPUT.style('position','absolute');
  URL_INPUT.style("text-align","center");
  URL_INPUT.style('left','0');
  URL_INPUT.style('bottom','0');
  URL_INPUT.style("border","none");
  URL_INPUT.mousePressed(SKETCH_CHOSEN);

  // create save button
  SAVE_BUTTON = createImg('icons/save.png');
  SAVE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  SAVE_BUTTON.parent('editbar');
  SAVE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  SAVE_BUTTON.style('position','absolute');
  SAVE_BUTTON.style('right','0');
  SAVE_BUTTON.style('bottom','0');
  SAVE_BUTTON.style("background-color",'#427bf5');
  SAVE_BUTTON.style("color","#ffffff");
  SAVE_BUTTON.style("border","none");
  SAVE_BUTTON.mousePressed(SAVE_DECKS);

// create tabs to signify text manipulation
TEXT_TABS = [];
TEXT_TABS[0] = createButton('Move Text');
TEXT_TABS[0].parent('textbar2');
TEXT_TABS[0].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
styleButton(TEXT_TABS[0]);
TEXT_TABS[0].mousePressed(BUTTON_CHOSEN);

  // create button to color text
TEXT_TABS[1] = createButton('Color Text');
TEXT_TABS[1].parent('textbar2');
TEXT_TABS[1].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
styleButton(TEXT_TABS[1]);
TEXT_TABS[1].mousePressed(BUTTON_CHOSEN);

  // create button to scale text (box)
TEXT_TABS[2] = createButton('Scale Text');
TEXT_TABS[2].parent('textbar2');
TEXT_TABS[2].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
styleButton(TEXT_TABS[2]);
TEXT_TABS[2].mousePressed(BUTTON_CHOSEN);

  // create button to animate text
TEXT_TABS[3] = createButton('Animate Text');
TEXT_TABS[3].parent('textbar2');
TEXT_TABS[3].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
styleButton(TEXT_TABS[3]);
TEXT_TABS[3].mousePressed(BUTTON_CHOSEN);


// create tabs to signify shape creation
  SHAPE_TABS = [];
  SHAPE_TABS[0] = createImg('icons/circle.png');
  SHAPE_TABS[0].parent('shapebar');
  SHAPE_TABS[0].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[0].style('padding',SIDEBAR_SIZEX/16 + 'px');
  styleButton(SHAPE_TABS[0]);
  SHAPE_TABS[0].mousePressed(SHAPE_ELLIPSE);

  // create button to create rectangle
  SHAPE_TABS[1] = createImg('icons/square.png');
  SHAPE_TABS[1].parent('shapebar');
  SHAPE_TABS[1].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[1].style('padding',SIDEBAR_SIZEX/16 + 'px');
  styleButton(SHAPE_TABS[1]);
  SHAPE_TABS[1].mousePressed(SHAPE_RECT);


  // create button to create triangle
  SHAPE_TABS[2] = createImg('icons/triangle-top-arrow.png');
  SHAPE_TABS[2].parent('shapebar');
  SHAPE_TABS[2].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[2].style('padding',SIDEBAR_SIZEX/16 + 'px');
  styleButton(SHAPE_TABS[2]);
  SHAPE_TABS[2].mousePressed(SHAPE_TRIANGLE);


  // create button to create arrow
  SHAPE_TABS[3] = createImg('icons/long-arrow-left.png');
  SHAPE_TABS[3].parent('shapebar');
  SHAPE_TABS[3].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[3].style('padding',SIDEBAR_SIZEX/16 + 'px');
  styleButton(SHAPE_TABS[3]);
  SHAPE_TABS[3].mousePressed(SHAPE_ARROW);


  GOBACK_BUTTON = createImg('icons/close-round.png');
  GOBACK_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  GOBACK_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  GOBACK_BUTTON.hide();
  GOBACK_BUTTON.mousePressed(BACK_TO_SIDEBAR);
  GOBACK_BUTTON.style('position','absolute');
  GOBACK_BUTTON.style('left',str((2*SIDEBAR_SIZEX/3)) + 'px');
  GOBACK_BUTTON.style('bottom','0');
  GOBACK_BUTTON.style("background-color",'#32cd32');
  GOBACK_BUTTON.style("color","#ffffff");
  GOBACK_BUTTON.style("border","none");
  GOBACK_BUTTON.style('z-index', 11);

DECK_TABS = [];
}

// Interaction Checker
p5.slidesUI.prototype.checkInteraction = function(){

  drawShapeOutlines();

  if (NEWOBJS_ != null) {
    this.decks.push(NEWOBJS_);
    this.showDeckTabs(this.decks);
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
  this.decks[CURRENTDECK-1].currentSlide = CURRENTSLIDE;
  MAXSLIDE = this.decks[CURRENTDECK-1].deckLength;
  MARGINS = this.decks[CURRENTDECK-1].margins;
}

  // Draw Text Now
  if (DRAWNOW) {
  this.drawFromTouch();
  TRACKED_TOUCHES = '';
  DRAWNOW = false;
  }

  // Resize Added Text
  if (this.decks.length != 0) {

      this.textResizer();

    // add slides to existing decks if necessary
    if (REVISION_TOGGLE || this.decks[CURRENTDECK - 1].deckLength == 0) {
      this.decks[CURRENTDECK - 1].addSlides(1);
      REVISION_TOGGLE = null;
    }


    //define complementary colors for background and text
    background(color(0, 0, 0));

    if (TOGGLE_SAVE){
      this.saveSlides();
      TOGGLE_SAVE = false;
    }


    // Elements to toggle
    if (TOGGLED == true) {
      this.toggleCanvases();
      this.iframeRemapper();
      this.inputRemapper();
      this.toggleEditText();
    }

    this.togglePresentText();

    if (TOGGLED == true) {
      TOGGLED = false;
      PREVKEY = "";
    }

    // show slide number
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    stroke('white');
    fill('white');
    text(CURRENTSLIDE + '/' + MAXSLIDE,width-15,height-10);
  }
}


// SLIDE DECK OBJECT


p5.slideDeck = function(name) {

  if (MARGINS !== null){
    this.margins = MARGINS;
  } else {
    this.margins = width/24;;
  }
  this.name = name;
  this.sketches = []; // initialize the sketch array
  this.deckLength = 0;
  this.templates = [];
  this.headings = [];
  this.subheadings = [];
  this.created_text = [];
  this.created_text[0] = []; // header cache
  this.created_text[1] = []; // subheader cache
  this.created_text[2] = []; // body text cache
  this.shapes = [];
  this.canvases = [];
  this.bColors = [];
  this.colorOptions = [color(0,0,0), color(288,288,288)];
}

// TEMPLATE CHARACTERISTICS
p5.slideDeck.prototype.slideTemplates = function(slide) {


  let template = this.templates[slide];
  let header = this.headings[slide];
  let subheader = this.subheadings[slide];
  let textColor = color(0,0,0);
  let yRatio = null;

  // Determine header length for automatic sizing
  if (template == 'full-text') {

    // header
    let H = createElement('textarea',header);
    H.attribute('xRatio',1);
    H.size(MAIN_CANVAS.width-2*MARGINS,(2*MAIN_CANVAS.height/3)-MARGINS);
    H.position(SIDEBAR_SIZEX+MARGINS,MARGINS);
    yRatio =  H.height/(MAIN_CANVAS.height- 2*MARGINS);
    H.attribute('yRatio',yRatio);
    H.attribute('xRelative',H.position().x-SIDEBAR_SIZEX-MARGINS)
    H.attribute('yRelative',H.position().y - MARGINS);
    H = formatText(H,0,false);
    H.hide();

    this.created_text[0][slide].push(H);

   // subheader
    let S = createElement('textarea',subheader);
    S.size(MAIN_CANVAS.width-2*MARGINS,(MAIN_CANVAS.height/3)-2*MARGINS);
    S.position(SIDEBAR_SIZEX +MARGINS, 2*height/3 + MARGINS)
    S.attribute('xRatio',1);
    yRatio =  S.height/(MAIN_CANVAS.height- 2*MARGINS);
    S.attribute('yRatio',yRatio);
    S.attribute('xRelative',S.position().x - SIDEBAR_SIZEX - MARGINS);
    S.attribute('yRelative',S.position().y - MARGINS);
    S = formatText(S,1, false);
    S.hide();


    this.created_text[1][slide].push(S);
  }

  if (template == 'low-header') {
    let ratio = 1;
    let bothWidth = (MAIN_CANVAS.width-2*MARGINS)*ratio;
    let subheaderHeight = (MAIN_CANVAS.height - 2*MARGINS)/12;
    // subheader
    let S = createElement('textarea',subheader);
    S.size(bothWidth,subheaderHeight);
    S.attribute('xRatio',ratio);
    yRatio =  S.height/(MAIN_CANVAS.height- 2*MARGINS);
    S.attribute('yRatio',yRatio);
    S.position(SIDEBAR_SIZEX+this.margins, MAIN_CANVAS.height - subheaderHeight - MARGINS);
    S.attribute('xRelative',S.position().x - SIDEBAR_SIZEX - MARGINS);
    S.attribute('yRelative',S.position().y - MARGINS);
    S = formatText(S,1, false);
    S.hide();
    this.created_text[1][slide].push(S);

// header

    let headerHeight = 2*subheaderHeight;
    let headerPos = MAIN_CANVAS.height - subheaderHeight - headerHeight - 3*MARGINS/2;
    let H = createElement('textarea',header);
    H.size(bothWidth,headerHeight);
    H.attribute('xRatio',1);
    yRatio =  H.height/(MAIN_CANVAS.height- 2*MARGINS);
    H.attribute('yRatio',yRatio);
    H.position(SIDEBAR_SIZEX+MARGINS,headerPos);
    H.attribute('xRelative',H.position().x - SIDEBAR_SIZEX - MARGINS);
    H.attribute('yRelative',H.position().y - MARGINS);
    H = formatText(H,0, false);
    H.hide();

    this.created_text[0][slide].push(H);

    Y_BOUNDS = [0, headerPos];
  }
}

// CREATE SLIDE ELEMENTS
p5.slideDeck.prototype.addSlides = function(num) {
  // add new slide to SlideDeck object

  let len = this.deckLength;
  for (let j = len; j < len + num; j++) {
    for (let i = 0; i < 3; i++) {
      this.created_text[i][j] = [];
    }
  }

  for (let i = 0; i < num; i++) {

    // define template creation order
    if (this.deckLength == 1){
      this.sketches[this.deckLength] = [0]; //[blankSketch]; //
      this.templates[this.deckLength] = 'low-header';
      this.headings[this.deckLength] = 'Showcase Mode';
      this.subheadings[this.deckLength] = 'Show off a single sketch';
    } else if (this.deckLength == 0) {
      this.sketches[this.deckLength] = []; //[blankSketch]; //
      this.templates[this.deckLength] = 'full-text';
      this.headings[this.deckLength] = 'P5.SLIDES';
      this.subheadings[this.deckLength] = 'INTERACTIVE PRESENTATIONS FOR THE WEB';
    } else if (this.deckLength > 2) {
        this.sketches[this.deckLength] = [];
        this.templates[this.deckLength] = 'full-sketch';
        this.headings[this.deckLength] = '';
        this.subheadings[this.deckLength] = '';
    } else if (this.deckLength == 2) {
      this.sketches[this.deckLength] = [1,1];
      this.templates[this.deckLength] = 'low-header';
      this.headings[this.deckLength] = 'Panel Mode';
      this.subheadings[this.deckLength ] = 'Expand your visual repertoire';
    }

    // let options = [0,1];
    // let choice = random(options);
    let choice = 0;

    this.bColors[this.deckLength] = this.colorOptions[choice];
    this.slideTemplates(this.deckLength);
    this.deckLength += 1;
  }
}

// HARDCODED NAVIGATION FUNCTION
function keyReleased() {
  if ((key > 0) && (PREVKEY != key) && (key < MAXSLIDE)) {
    PREVSLIDE = CURRENTSLIDE;
    CURRENTSLIDE = key;
    TOGGLED = true;
  } else if ((key === 'ArrowRight') && (PREVKEY != key) && (CURRENTSLIDE <= MAXSLIDE)) {
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
p5.slidesUI.prototype.editMode = function() {
  PRESENT_BUTTON.show();
  EDIT_BUTTON.hide();
  SIDEBAR.show();
  MAIN_CANVAS.size(windowWidth - SIDEBAR_SIZEX, windowHeight);
  MAIN_CANVAS.position(SIDEBAR_SIZEX, 0);
  TOGGLED = true;
  PREVSLIDE = CURRENTSLIDE;
}

p5.slidesUI.prototype.presentMode = function() {
  PRESENT_BUTTON.hide();
  EDIT_BUTTON.show();
  SIDEBAR.hide();
  TOGGLED = true;
  PREVSLIDE = CURRENTSLIDE;

  MAIN_CANVAS.size(windowWidth,windowHeight);
  MAIN_CANVAS.position(0,0);
}

// Button Functionality
function ON_HOVER() {
 this.style('background-color','green');
  this.style('opacity','.3');
  this.style('color','white');
}

function OFF() {
  this.style('background-color','transparent');
  this.style('opacity','1');
  this.style('color', 'transparent')
}

function BACK_TO_SIDEBAR() {
  SKETCHBAR.hide();
  TEXTBAR1.hide();
  TEXTBAR2.hide();
  DECKBAR.hide();
  SHAPEBAR.hide();
  EDITSIDEBAR.show();
  GOBACK_BUTTON.hide();
}


function TOGGLE_SKETCHBAR() {
  SKETCHBAR.show();
  EDITSIDEBAR.hide();
  GOBACK_BUTTON.show();
}

function TOGGLE_TEXTBAR1() {
  TEXTBAR1.show();
  EDITSIDEBAR.hide();
  GOBACK_BUTTON.show();
}

function TOGGLE_TEXTBAR2() {
  TEXTBAR2.show();
  EDITSIDEBAR.hide();
  GOBACK_BUTTON.show();
}

function TOGGLE_DECKBAR() {
  DECKBAR.show();
  EDITSIDEBAR.hide();
  GOBACK_BUTTON.show();
}

function TOGGLE_SHAPEBAR() {
  SHAPEBAR.show();
  EDITSIDEBAR.hide();
  GOBACK_BUTTON.show();
}

function SKETCH_CHOSEN() {

  if (CHOSEN_SKETCH != null){
    CHOSEN_SKETCH.style('border','none');
    this.style('margin-top', '0px');
  }

  CHOSEN_SKETCH = this;

      this.style('border','solid');
    this.style('border-color','#ffffff');
}

function BUTTON_CHOSEN() {
  this.style('border','solid');
  this.style('border-color','#ffffff');
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

function SHAPE_ELLIPSE() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'ellipse';
}
function SHAPE_RECT() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'rectangle';
}
function SHAPE_TRIANGLE() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'triangle';
}
function SHAPE_ARROW() {
  TRACKED_TOUCHES = 'waituntilended';
  DRAW_FROM_TOUCH = 'arrow';
}

p5.slidesUI.prototype.saveSlides = function() {

    // save JSON of current decks
    this.JSONify(this.decks);

    // save JSON of loaded sketches
    let sketchJSON = {}
    for (let i = 0; i < this.loadedSketches.length; i++) {
        sketchJSON[this.loadedSketches[i][0]] = this.loadedSketches[i][1]
    }
    saveJSON(sketchJSON, 'mySketches.json');

}


function SAVE_DECKS(){
  TOGGLE_SAVE = true;
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
  CURRENTDECK = int(ID_[0])-1;
  CURRENTSLIDE = 1;
  TOGGLED = true;
  PREVSLIDE = null;
  PREVKEY = "";
  Y_BOUNDS = [];
  X_BOUNDS = [];
}

// Button Styling
function styleButton(button){
  colorMode(HSL,100);
  button.style("background-color",color(random(0,100),random(25,95),random(35,65)));
  button.style("color","#ffffff");
  button.style("border","none");
  //button.style('z-index', 10);
}

p5.slidesUI.prototype.showDeckTabs = function(decks){
  let tabDiff = (decks.length - DECK_TABS.length);
  // add new tabs if necessary
  for (let j = tabDiff; j > 0; j--){
    DECK_TABS.push(createButton(decks[decks.length-j].name));
    DECK_TABS[DECK_TABS.length-1].id('decktab' + (j+1));
    DECK_TABS[DECK_TABS.length-1].style('z-index', 9);
    DECK_TABS[DECK_TABS.length-1].parent('deckbar');
    DECK_TABS[DECK_TABS.length-1].size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
    styleButton(DECK_TABS[DECK_TABS.length-1]);
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
  let currentExtent = null;
  let xRatio = null;
  let currentHeight = null;
  let yRatio = null;

  switch (DRAW_FROM_TOUCH) {
    case 'header':
      field = createElement('textarea','Your header here');
      field.position(SIDEBAR_SIZEX + min(TRACKED_TOUCHES[0],TRACKED_TOUCHES[2]),min(TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]));
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      currentExtent = (MAIN_CANVAS.width - 2*MARGINS);
      xRatio = field.width/currentExtent;
      field.attribute('xRatio',xRatio);
      currentHeight = (MAIN_CANVAS.height - 2*MARGINS);
      yRatio = field.height/currentHeight;
      field.attribute('yRatio',yRatio);
      field.attribute('xRelative',field.position().x - SIDEBAR_SIZEX - MARGINS);
      field.attribute('yRelative',field.position().y - MARGINS);
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      field.style('text-transform', 'uppercase');
      field.style('font-weight', 'bold');
      this.decks[CURRENTDECK - 1].created_text[0][CURRENTSLIDE-1].push(field);
      break;

    case 'subheader':
      field = createElement('textarea','Your subheader here');
      field.position(SIDEBAR_SIZEX + min(TRACKED_TOUCHES[0],TRACKED_TOUCHES[2]),min(TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]));
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      currentExtent = (MAIN_CANVAS.width - 2*MARGINS);
      xRatio = field.width/currentExtent;
      field.attribute('xRatio',xRatio);
      currentHeight = (MAIN_CANVAS.height - 2*MARGINS);
      yRatio = field.height/currentHeight;
      field.attribute('yRatio',yRatio);
      field.attribute('xRelative',field.position().x - SIDEBAR_SIZEX - MARGINS);
      field.attribute('yRelative',field.position().y - MARGINS);
      field.style("background", "transparent");
      field.style("color", "grey");
      field.style("border", "none");
      field.style('font-style', 'italic');
      this.decks[CURRENTDECK - 1].created_text[1][CURRENTSLIDE-1].push(field);
      break;


    case 'body':
      field = createElement('textarea','Your body text here');
      field.position(SIDEBAR_SIZEX + min(TRACKED_TOUCHES[0],TRACKED_TOUCHES[2]),min(TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]));
      field.size(abs(TRACKED_TOUCHES[2] - TRACKED_TOUCHES[0]), abs(TRACKED_TOUCHES[3] - TRACKED_TOUCHES[1]));
      currentExtent = (MAIN_CANVAS.width - 2*MARGINS);
      xRatio = field.width/currentExtent;
      field.attribute('xRatio',xRatio);
      currentHeight = (MAIN_CANVAS.height - 2*MARGINS);
      yRatio = field.height/currentHeight;
      field.attribute('yRatio',yRatio);
      field.attribute('xRelative',field.position().x - SIDEBAR_SIZEX - MARGINS);
      field.attribute('yRelative',field.position().y - MARGINS);
      field.style("background", "transparent");
      field.style("color", "white");
      field.style("border", "none");
      this.decks[CURRENTDECK - 1].created_text[2][CURRENTSLIDE-1].push(field);
      break;


    case 'sketch':
      let frame = createElement('iframe');
      let i_ = null; // holder for sketch choice
      let id =  CHOSEN_SKETCH.id();

      // if chosen sketch was not pre-loaded
      if (id == 'url_input'){
        this.loadedSketches.push(['name',CHOSEN_SKETCH.value()]);
        i_ = SKETCH_TABS.length;
        SKETCH_TABS[i_] = createButton(this.loadedSketches[this.loadedSketches.length-1][0]);
        SKETCH_TABS[i_].attribute('url', CHOSEN_SKETCH.value());
        SKETCH_TABS[i_].id('sketchtab' + i_);
        styleButton(SKETCH_TABS[i_]);
        SKETCH_TABS[i_].mousePressed(SKETCH_CHOSEN);
        SKETCH_TABS[i_].size(SIDEBAR_SIZEX, SIDEBAR_SIZEY);
        SKETCH_TABS[i_].parent('sketchbar');
      } else {
        let regex = "\\d+";
        i_= match(id,regex);
        i_ = i_[0];
      }

      frame.attribute('src',this.loadedSketches[i_][1]);
      frame.size(abs(TRACKED_TOUCHES[2]-TRACKED_TOUCHES[0]),abs(TRACKED_TOUCHES[3]-TRACKED_TOUCHES[1]));
      frame.position(SIDEBAR_SIZEX + min(TRACKED_TOUCHES[0],TRACKED_TOUCHES[2]),min(TRACKED_TOUCHES[1],TRACKED_TOUCHES[3]));
      currentExtent = (MAIN_CANVAS.width - 2*MARGINS);
      xRatio = frame.width/currentExtent;
      frame.attribute('xRatio',xRatio);
      currentHeight = (MAIN_CANVAS.height - 2*MARGINS);
      yRatio = frame.height/currentHeight;
      frame.attribute('yRatio',yRatio);
      frame.attribute('xRelative',frame.position().x - SIDEBAR_SIZEX - MARGINS);
      frame.attribute('yRelative',frame.position().y - MARGINS);
      frame.style('border',"transparent");
      frame.style('overflow', "hidden");
      frame.style('z-index', 1);
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].push(frame);
      this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].push(this.loadedSketches.length-1);
      break;
  }

  let shapeTypes = ['ellipse','rectangle','triangle','arrow']
  if (shapeTypes.indexOf(DRAW_FROM_TOUCH) !== -1){
    let relLC_X = (TRACKED_TOUCHES[0] - SIDEBAR_SIZEX - MARGINS)/MAIN_CANVAS.width;
    let relLC_Y = (TRACKED_TOUCHES[1] - MARGINS)/MAIN_CANVAS.height;
    let relRC_X = (TRACKED_TOUCHES[2] - SIDEBAR_SIZEX - MARGINS)/MAIN_CANVAS.height;
    let relRC_Y = (TRACKED_TOUCHES[3] - MARGINS)/MAIN_CANVAS.width;
    if (this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH] === undefined){
      this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH] = [];
      if (this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1] === undefined){
        this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1] = [];
      }
    }
    this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1].push(createVector(relLC_X,relLC_Y, relRC_X,relRC_Y));
    console.log(this.decks[CURRENTDECK - 1].shapes);
  }
  TRACKED_TOUCHES = '';
}


p5.slidesUI.prototype.textResizer = function() {

  let val = null;

  for (let i = 0; i < this.decks[CURRENTDECK - 1].created_text.length; i++) {
    // i = header / subheader / body
    let z = (CURRENTSLIDE - 1)
    // z = slide number
    if (this.decks[CURRENTDECK - 1].created_text[i][z] !== undefined) {
      for (let j = 0; j < this.decks[CURRENTDECK - 1].created_text[i][z].length; j++) {
        // j = specific bit of text
        let font = 0;
        textSize(1);
        val = this.decks[CURRENTDECK - 1].created_text[i][z][j].value();
        let w = textWidth(val.toUpperCase());
        let h = this.decks[CURRENTDECK - 1].created_text[i][z][j].size();
        font = min([(MAIN_CANVAS.width/w)*.9,h.height*.9]);

        this.decks[CURRENTDECK - 1].created_text[i][z][j].style("font-size", font + "px");
        this.decks[CURRENTDECK - 1].created_text[i][z][j].mousePressed(TOGGLE_TEXTBAR2);
      }
    }
  }
}


// ADDITIONAL FUNCTIONALITY

// Dynamically resize the window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function drawShapeOutlines(){
  if (TRACKED_TOUCHES.length == 2) {
    noFill();
    stroke('white');
    let rects = ['heading', 'subheading', 'body', 'sketch', 'rectangle'];
    let x_shift = TRACKED_TOUCHES[0];
    let y_shift = TRACKED_TOUCHES[1];
    let x_diff = (mouseX - x_shift);
    let y_diff = (mouseY - y_shift)
    let a = atan2(y_diff,x_diff);

    push();
    translate(x_shift,y_shift);

    if (rects.indexOf(DRAW_FROM_TOUCH) !== -1) {
      rect(0, 0, x_diff, y_diff);
    } else if (DRAW_FROM_TOUCH == 'ellipse') {
      ellipse(x_diff / 2, y_diff / 2, abs(x_diff), abs(y_diff));
    } else if (DRAW_FROM_TOUCH == 'triangle') {
      let d = int(dist(TRACKED_TOUCHES[0], TRACKED_TOUCHES[1], mouseX, mouseY));
      let x = (d / (sqrt(3)));
      rotate(a);
      vertex(0, 0);
      vertex(d, x);
      vertex(d,- x);

    } else if (DRAW_FROM_TOUCH == 'arrow') {
      rotate(a+ PI/2);
      let d_tot = int(dist(TRACKED_TOUCHES[0], TRACKED_TOUCHES[1], mouseX, mouseY));
      let d_tri = (d_tot / 3);
      let x_tri = (d_tri / (sqrt(3)));
      vertex(0, 0);
      vertex(- x_tri, - 2 * x_tri);
      vertex(- x_tri / 2, - d_tri);
      vertex(- x_tri / 2, - d_tot);
      vertex(x_tri / 2, - d_tot);
      vertex(x_tri / 2, - d_tri);
      vertex(x_tri,- 2 * x_tri);
    }
    endShape(CLOSE);
    pop();
  }
}


p5.slidesUI.prototype.toggleShapes = function(){
  let relLC_X = (TRACKED_TOUCHES[0] - SIDEBAR_SIZEX - MARGINS)/MAIN_CANVAS.width;
  let relLC_Y = (TRACKED_TOUCHES[1] - MARGINS)/MAIN_CANVAS.height;
  let relRC_X = (TRACKED_TOUCHES[2] - SIDEBAR_SIZEX - MARGINS)/MAIN_CANVAS.height;
  let relRC_Y = (TRACKED_TOUCHES[3] - MARGINS)/MAIN_CANVAS.width;
  if (this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH] === undefined){
    this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH] = [];
    if (this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1] === undefined){
      this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1] = [];
    }
  }
  this.decks[CURRENTDECK - 1].shapes[DRAW_FROM_TOUCH][CURRENTSLIDE-1].push(createVector(relLC_X,relLC_Y, relRC_X,relRC_Y));

  noFill();
  stroke('white');
  let rects = ['heading', 'subheading', 'body', 'sketch', 'rectangle'];
  let x_shift = TRACKED_TOUCHES[0];
  let y_shift = TRACKED_TOUCHES[1];
  let x_diff = (mouseX - x_shift);
  let y_diff = (mouseY - y_shift)
  let a = atan2(y_diff,x_diff);

  push();
  translate(x_shift,y_shift);

  if (rects.indexOf(DRAW_FROM_TOUCH) !== -1) {
    rect(0, 0, x_diff, y_diff);
  } else if (DRAW_FROM_TOUCH == 'ellipse') {
    ellipse(x_diff / 2, y_diff / 2, abs(x_diff), abs(y_diff));
  } else if (DRAW_FROM_TOUCH == 'triangle') {
    let d = int(dist(TRACKED_TOUCHES[0], TRACKED_TOUCHES[1], mouseX, mouseY));
    let x = (d / (sqrt(3)));
    rotate(a);
    vertex(0, 0);
    vertex(d, x);
    vertex(d,- x);

  } else if (DRAW_FROM_TOUCH == 'arrow') {
    rotate(a+ PI/2);
    let d_tot = int(dist(TRACKED_TOUCHES[0], TRACKED_TOUCHES[1], mouseX, mouseY));
    let d_tri = (d_tot / 3);
    let x_tri = (d_tri / (sqrt(3)));
    vertex(0, 0);
    vertex(- x_tri, - 2 * x_tri);
    vertex(- x_tri / 2, - d_tri);
    vertex(- x_tri / 2, - d_tot);
    vertex(x_tri / 2, - d_tot);
    vertex(x_tri / 2, - d_tri);
    vertex(x_tri,- 2 * x_tri);
  }
  endShape(CLOSE);
  pop();
}




}




p5.slidesUI.prototype.toggleCanvases = function(){

// initialize empty canvas holders

  if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] === undefined) {
    this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] = [];
  }

  // hide previous sketches
  if (PREVSLIDE != null) {
    let canvases = this.decks[CURRENTDECK - 1].canvases[PREVSLIDE - 1];
    for (let c = 0; c < canvases.length; c++) {
      this.decks[CURRENTDECK - 1].canvases[PREVSLIDE - 1][c].hide();
    }
  }



  if (this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1] === undefined){
    this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1] = [];
  }

  let sketchesForSlide = this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1];

  // initialize sketch canvases

  if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].length == 0 && sketchesForSlide.length > 0) {

    // place new sketches

    let p = this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].length;
    let currentExtent = null;
    let currentHeight = null;
    let xRatio = null;
    let yRatio = null;
    let frame = null;
    let x_off = null;
    let spacing = null;

    if (EDITSIDEBAR.style('display') == 'none') {
      x_off = 0;
    } else{
      x_off = SIDEBAR_SIZEX;
    }

    if (p > 1){
      spacing = MARGINS;
    } else {
      spacing = 0;
    }

    let dx = (MAIN_CANVAS.width - 2*MARGINS- ((p-1)*spacing))/p;




    for (let i = 0; i < p; i++){
      frame = createElement('iframe');
      frame.attribute('src',this.loadedSketches[sketchesForSlide[i]][1]);
      frame.size(abs(dx*(i+1)-dx*(i)),abs(Y_BOUNDS[1]-Y_BOUNDS[0]));
      if (i == 0) {
        frame.position(x_off + MARGINS + (dx*i), min(Y_BOUNDS) + MARGINS);
      } else {
        frame.position(x_off + MARGINS + (spacing*i) + (dx*i), min(Y_BOUNDS) + MARGINS);
      }
      currentExtent = (MAIN_CANVAS.width);
      xRatio = frame.width/currentExtent;
      frame.attribute('xRatio',xRatio);
      currentHeight = (MAIN_CANVAS.height);
      yRatio = frame.height/currentHeight;
      frame.attribute('yRatio',yRatio);
      frame.attribute('xRelative',frame.position().x - SIDEBAR_SIZEX - MARGINS);
      frame.attribute('yRelative',frame.position().y - MARGINS);
      frame.style('border','transparent');
      frame.style('overflow', 'hidden');
      frame.style('scrolling',"no");
      frame.style('z-index', 1);
      frame.style('pointer-events','none');
      frame.show();
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].push(frame);
    }
  } else {
      let canvases = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1];
      for (let c = 0; c < canvases.length; c++) {
          this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][c].show();
      }
  }
}

p5.slidesUI.prototype.toggleEditText = function() {

  LOGGED_SIZES = [];

  if (SIDEBAR.style('display') == 'block') {

  let allText = this.decks[CURRENTDECK - 1].created_text;

  for (let text_iter = 0; text_iter < allText.length; text_iter++) {

    // hide previous text
    if (PREVSLIDE != null) {
      let text = allText[text_iter][PREVSLIDE - 1];
      if (text !== undefined) {
      if (text.length != 0) {
        for (let t = 0; t < text.length; t++) {
          this.decks[CURRENTDECK - 1].created_text[text_iter][PREVSLIDE - 1][t].hide();
        }
      }
      }
    }

      let textForSlide = allText[text_iter][CURRENTSLIDE - 1];

    // initialize text if necessary
    if (textForSlide !== undefined) {
      if (textForSlide.length != 0) {
        for (let t = 0; t < textForSlide.length; t++) {
          this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t].show();
          this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t].style('z-index', ((allText.length - text_iter) + 1));
        }
      }
    }
    }
  }
}

p5.slidesUI.prototype.togglePresentText = function(){

  if (SIDEBAR.style('display') == 'none') {
    let allText = this.decks[CURRENTDECK - 1].created_text;

    for (let text_iter = 0; text_iter < allText.length; text_iter++) {
      let textForSlide = allText[text_iter][CURRENTSLIDE - 1];

      if (LOGGED_SIZES[text_iter] === undefined) {
        LOGGED_SIZES[text_iter] = [];
      }

      let currentText = null;
      let size = null;
      let i_s = null;
      let padding = null
      let paddingY = null

      // show preplaced text
      if (textForSlide !== undefined) {
       if (textForSlide.length != 0) {
         for (let t = 0; t < textForSlide.length; t++) {
           currentText = this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t];
           if (LOGGED_SIZES[text_iter].length == 0) {
             LOGGED_SIZES[text_iter][t] = int(match(currentText.style("font-size"), "\\d+")[0]);
           }
           textFont(currentText.style('font-family'));
           textSize(LOGGED_SIZES[text_iter][t]);
           formatText(currentText,text_iter,true);
         }
       }
      }

      if (TOGGLED) {
        // hide previous text
        if (PREVSLIDE != null) {
          let text = allText[text_iter][PREVSLIDE - 1];
          if (text !== undefined) {
            for (let t = 0; t < text.length; t++) {
              this.decks[CURRENTDECK - 1].created_text[text_iter][PREVSLIDE - 1][t].hide();
            }
          }
        }
      }

    }
  }
}

p5.slidesUI.prototype.iframeRemapper = function(){
// Dynamically Resize IFrames
if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] === undefined) {
  this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] = [];
}



let len = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1].length;
let currentFrame = null;
  let currentExtent = null;
  let currentHeight = null;
  let xRel = null;
  let yRel = null;
  let yRatio = null;
  let xRatio = null;

  if (len != 0) {
    for (let i = 0; i < len; i++) {
      currentFrame = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i];
      currentExtent = (MAIN_CANVAS.width);
      currentHeight = (MAIN_CANVAS.height);
      yRatio = float(currentFrame.attribute('yRatio'));
      xRatio = float(currentFrame.attribute('xRatio'));
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].size(currentExtent*xRatio, currentHeight*yRatio);
      xRel =  float(currentFrame.attribute('xRelative'));
      yRel = float(currentFrame.attribute('yRelative'));
      if (SIDEBAR.style('display') == 'none') {
        this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].position(MARGINS + xRel, yRel);
      } else {
        this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].position(MARGINS + SIDEBAR_SIZEX + xRel, yRel);
      }
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].style('z-index', 1);
    }
  }
}

p5.slidesUI.prototype.inputRemapper = function() {

  let allText = this.decks[CURRENTDECK - 1].created_text;
  let currentExtent = (MAIN_CANVAS.width - 2*MARGINS);
  let currentHeight = (MAIN_CANVAS.height - 2*MARGINS);

  for (let text_iter = 0; text_iter < allText.length; text_iter++) {

    let textForSlide = null;
    textForSlide = allText[text_iter][CURRENTSLIDE - 1];
    if (textForSlide !== undefined) {

      for (let t = 0; t < textForSlide.length; t++) {
        let yRatio = null;
        let xRatio = null;
        let xRel = null;
        let yRel = null;
        let text = null;

        text = this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t];
        yRatio = float(text.attribute('yRatio'));
        xRatio = float(text.attribute('xRatio'));
        if (SIDEBAR.style('display') == 'none') {
          xRel = MARGINS + float(text.attribute('xRelative'));
        } else {
          xRel = SIDEBAR_SIZEX + MARGINS + float(text.attribute('xRelative'));
          }
        yRel = float(text.attribute('yRelative')) + MARGINS;
        this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t].size(currentExtent*xRatio, currentHeight*yRatio);
        this.decks[CURRENTDECK - 1].created_text[text_iter][CURRENTSLIDE - 1][t].position(xRel, yRel);

      }
    }
  }
}

p5.slidesUI.prototype.JSONify = function(deckObj){
    let deckJSON = {}
    let keys  = (Object.keys(deckObj));
    for (let deck = 0; deck < keys.length;deck++){
        let firstIndex = keys[deck];
        let topKey = deckObj[firstIndex].name;
        deckJSON[topKey] = {};

        // insert color options
        deckJSON[topKey]['colorOptions'] = deckObj[deck].colorOptions;

        // insert deck length
        deckJSON[topKey]['deckLength'] = deckObj[deck].deckLength;

        // insert margins
        deckJSON[topKey]['margins'] = deckObj[deck].margins;

        for (let slide = 0; slide < deckObj[firstIndex].deckLength; slide++){
            let subKey = 'slide'+slide;
            deckJSON[topKey][subKey] = {};

            // initialize created text object
            deckJSON[topKey][subKey]['createdText'] = {};

            // initialize canvas object
            deckJSON[topKey][subKey]['canvases'] = {};

            // insert background colors
            deckJSON[topKey][subKey]['bColors'] = deckObj[deck].bColors[slide];

            // insert created text
            deckJSON[topKey][subKey]['createdText'] = {};
            for (let type = 0; type < deckObj[deck].created_text.length;type++) {
                let typeName;
                if (type == 0) {
                    typeName = 'headers';
                } else if (type == 1) {
                    typeName = 'subheaders';
                } else if (type == 2) {
                    typeName = 'body';
                }

                let numBoxes = deckObj[deck].created_text[type][slide].length;
                for (let box = 0; box < numBoxes; box++) {

                        if (deckJSON[topKey][subKey]['createdText'][typeName] === undefined){
                            deckJSON[topKey][subKey]['createdText'][typeName] = {};
                        }

                        deckJSON[topKey][subKey]['createdText'][typeName][box] = {};
                        deckJSON[topKey][subKey]['createdText'][typeName][box]['yRatio'] = deckObj[deck].created_text[type][slide][box].attribute('yRatio');
                            deckJSON[topKey][subKey]['createdText'][typeName][box]['xRatio'] =deckObj[deck].created_text[type][slide][box].attribute('xRatio');
                                deckJSON[topKey][subKey]['createdText'][typeName][box]['xRelative'] = deckObj[deck].created_text[type][slide][box].attribute('xRelative');
                                    deckJSON[topKey][subKey]['createdText'][typeName][box]['yRelative'] =deckObj[deck].created_text[type][slide][box].attribute('yRelative');
                                        deckJSON[topKey][subKey]['createdText'][typeName][box]['text'] = deckObj[deck].created_text[type][slide][box].value();
                    }
                }

            // insert canvases
            canvasKeys = (Object.keys(deckObj[deck]['canvases']));
            deckJSON[topKey][subKey]['canvases'] = {};

         if (deckObj[deck].canvases[slide] !== undefined) {
             for (let element = 0; element < deckObj[deck].canvases[slide].length; element++) {
                 deckJSON[topKey][subKey]['canvases']['frame' + element] = {};
                 deckJSON[topKey][subKey]['canvases']['frame' + element]['yRatio'] = deckObj[deck].canvases[slide][element].attribute('yRatio');
                 deckJSON[topKey][subKey]['canvases']['frame' + element]['xRatio'] = deckObj[deck].canvases[slide][element].attribute('xRatio');
                 deckJSON[topKey][subKey]['canvases']['frame' + element]['xRelative'] = deckObj[deck].canvases[slide][element].attribute('xRelative');
                 deckJSON[topKey][subKey]['canvases']['frame' + element]['yRelative'] = deckObj[deck].canvases[slide][element].attribute('yRelative');
                 deckJSON[topKey][subKey]['canvases']['frame' + element]['url'] = deckObj[deck].canvases[slide][element].attribute('src');
             }
         }
        }
    }

    saveJSON(deckJSON, 'myDecks.json');
}

p5.slidesUI.prototype.unpackJSON = function(JSON) {
  let myDecks = [];

  let keys = (Object.keys(JSON));
  for (let deck = 0; deck < keys.length; deck++) {
    let firstIndex = keys[deck];
    myDecks[deck] = new p5.slideDeck(firstIndex);

    let secondKeys = Object.keys(JSON[firstIndex]);
    for (let key2_ = 0; key2_ < secondKeys.length; key2_++)
      if (match(secondKeys[key2_],'slide')) {
        let regex = "\\d+";
        let slideNum = int(match(secondKeys[key2_],regex));
        let tertiaryKeys = Object.keys(JSON[firstIndex][secondKeys[key2_]]);
        for (let key3_ = 0; key3_ < tertiaryKeys.length; key3_++){

          // load background colors
          if (match(tertiaryKeys[key3_], 'bColors')) {
            let mode = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]['mode']
                let max = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]['maxes'][mode]
                let levels = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]['levels']
            colorMode(mode,max[0])
            myDecks[deck][tertiaryKeys[key3_]][slideNum] = color(levels[0],levels[1],levels[2],levels[3]);
          }

          // load created text

          else if (match(tertiaryKeys[key3_], 'createdText')) {
            let presentTypes = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            for (let type = 0; type < presentTypes.length; type++) {
              let ind_;
              if (presentTypes[type] == 'headers') {
                ind_ = 0;
              } else if (presentTypes[type] == 'subheaders') {
                ind_ = 1;
              } else if (presentTypes[type] == 'body') {
                ind_ = 2;
              }

              let selectedText = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][presentTypes[type]]);

              for (let box = 0; box < selectedText.length; box++) {
                let textToPlace = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][presentTypes[type]][selectedText[box]];
                let thisText = createElement('textarea', textToPlace['text']);
                thisText = formatText(thisText,ind_, false);
                thisText.attribute('xRatio', textToPlace['xRatio']);
                thisText.attribute('yRatio', textToPlace['yRatio']);
                thisText.attribute('xRelative', textToPlace['xRelative']);
                thisText.attribute('yRelative', textToPlace['yRelative']);
                myDecks[deck].created_text[ind_][slideNum] = [];
                myDecks[deck].created_text[ind_][slideNum].push(thisText);
              }
            }


            // load canvases

          } else if (match(tertiaryKeys[key3_], 'canvases')) {

            let frames = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            for (let frame = 0; frame < frames.length; frame++) {
              let selectedFrame = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][frames[frame]];
              let thisFrame = createElement('iframe');
              thisFrame.attribute('src',selectedFrame['url']);
              thisFrame.attribute('xRatio',selectedFrame['xRatio']);
              thisFrame.attribute('yRatio',selectedFrame['yRatio']);
              thisFrame.attribute('xRelative',selectedFrame['xRelative']);
              thisFrame.attribute('yRelative',selectedFrame['yRelative']);
              thisFrame.style('border','transparent');
              thisFrame.style('overflow', 'hidden');
              thisFrame.style('scrolling',"no");
              thisFrame.style('z-index', 1);
              thisFrame.style('pointer-events','none');
              thisFrame.hide();
              myDecks[deck].canvases[slideNum] = [];
              myDecks[deck].canvases[slideNum].push(thisFrame);
            }
            //myDecks[deck][tertiaryKeys[key3_]] = JSON[firstIndex][secondKeys[key2_][tertiaryKeys[key3_]]];
          }
      }
      }else {
        myDecks[deck][secondKeys[key2_]] = JSON[firstIndex][secondKeys[key2_]];
      }
    }
    this.decks = myDecks;
  }


  function formatText(t,type,flag) {
    let i_s = null;
    let padding = null;
    let paddingY = null;
    let val = null;

    if (flag == false) {
      t.style('wrap', 'hard');
      t.style('background-color', 'transparent');
      t.style('color', 'white');
      t.style('text-align', 'left');
    } else {
      textAlign(LEFT,TOP);
      fill('white');
      stroke('white');
      i_s = t.height;
      paddingY = i_s * .04;
      padding = int(match(t.style('padding'), "\\d+")[0]);
    }

    if (type == 0) {
      if (flag == false) {
        t.style('text-transform', 'uppercase');
        t.style('font-weight', 'bold');
        t.style('z-index', 4);
      } else {
        textStyle(BOLD);
        val = t.value();
        text(val.toUpperCase(), t.x + padding, t.y + paddingY);
      }
    } else if (type == 1) {
    if (flag == false) {
      t.style('font-style', 'italic');
      t.style('z-index', 3);
    } else {
      textStyle(ITALIC);
      text(t.value(),t.x+padding,t.y+paddingY);
    }
  } else if (type == 2) {

      if (flag == true) {
        text(t.value(), t.x + padding, t.y + paddingY);
      }
    }

    return t
  }