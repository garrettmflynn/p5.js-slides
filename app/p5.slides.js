
/*
  PS.SLIDES
  Written by Garrett Flynn | December 2019
*/


// =============================================================================
//                                  p5.SlidesUI
// =============================================================================
/**
 * Base class for the p5.slides user interface
 *
 * @class p5.SlidesUI
 * @constructor
 */
p5.SlidesUI = function(savedDecks,sketchesToLoad) {
  this.decks = [];
  this.loadedSketches = [];

  // load supplied sketches
  keys = Object.keys(sketchesToLoad);
  for (let i = 0; i < keys.length; i++){
    this.loadedSketches.push([keys[i],sketchesToLoad[keys[i]]]);
  }

  this.allGlobalVariables(1);

  // load old decks if available, or create a new deck
  if (savedDecks === undefined || savedDecks.length == 0) {
    this.margins = MAIN_CANVAS.width/24;
    this.allGlobalVariables(2);
    this.createSidebars();

    this.decks.push(new p5.SlideDeck('Intro to P5.Slides'));

    // add template slides
    let slides_to_create = 4;
    this.decks[CURRENTDECK - 1].addSlides(slides_to_create);

    // create first deck tab
    this.showDeckTabs(this.decks);
  } else {
    this.unpackJSON(savedDecks);
    this.allGlobalVariables(2);
    this.createSidebars();
    this.showDeckTabs(this.decks);
  }

  this.allGlobalVariables(3);
}
p5.prototype.registerPreloadMethod('SlidesUI', p5.SlidesUI);

p5.SlidesUI.prototype.allGlobalVariables = function(set){



  if (set == 1) {
    MAIN_CANVAS = createCanvas(windowWidth, windowHeight);
    TRACKED_TOUCHES = '';
    TEXTCOUNT = 0;
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
    Y_BOUNDS = [];
    X_BOUNDS = [];
    TOGGLED = true;
    CHOSEN_OBJ = null;
    NEWOBJS_ = null;
    DRAWNOW = false;
    IN_OR_OUT = '';

    // fonts
    FONTS_2 = createElement('link');
    FONTS_2.attribute('href','https://fonts.googleapis.com/css?family=Inconsolata:400,700&display=swap');
    FONTS_2.attribute('rel','stylesheet');
    FONTS = [loadFont('fonts/Inconsolata-Bold.otf'), loadFont('fonts/Inconsolata-Regular.otf')];

    SIDEBAR_SIZEY = height/20;
    SIDEBAR_SIZEX = width/6;

    START_ANIMATION = [[]];
  } else if (set == 3){
    DECKS = this.decks;
    NUMDECKS = this.decks.length;
    MAXSLIDE = this.decks[CURRENTDECK-1].deckLength;
    LOGGED_SIZES = [];
  }
}

// Main Looping Functions
p5.SlidesUI.prototype.display = function() {

  if (this.decks.length != 0) {
    background('#ffffff');


    // Toggles

    // resize existing text
    this.textResizer();

    // toggle drawing from user input
    if (DRAWNOW) {
      this.drawFromTouch();
      TRACKED_TOUCHES = '';
      DRAWNOW = false;
    }

    // toggle slide addition
    if (REVISION_TOGGLE || this.decks[CURRENTDECK - 1].deckLength == 0) {
      this.decks[CURRENTDECK - 1].addSlides(1);
      REVISION_TOGGLE = null;
    }

    // toggle save
    if (TOGGLE_SAVE){
      this.saveSlides();
      TOGGLE_SAVE = false;
    }

    // toggle non-HTML elements
    this.togglePresentationAssets();

    // toggle created elements
    if (TOGGLED) {
      this.toggleCanvases();
      this.iframeRemapper();
      this.inputRemapper();
      this.toggleEditText();
    }


    // turn off toggle
    if (TOGGLED) {
      TOGGLED = false;
    }

    // Variable Passing
    NUMDECKS = this.decks.length;
    this.decks[CURRENTDECK-1].currentSlide = CURRENTSLIDE;
    MAXSLIDE = this.decks[CURRENTDECK-1].deckLength;
    MARGINS = this.decks[CURRENTDECK-1].margins;

    // Show available slides at the bottom left
    textSize(20);
    textAlign(RIGHT,BOTTOM);
    stroke('#eb7899');
    fill('#eb7899');
    strokeWeight(1);
    text(CURRENTSLIDE + '/' + MAXSLIDE,width-15,height-10);
  }
}
p5.SlidesUI.prototype.checkInteraction = function(){

  drawShapeOutlines();
  DECKS = this.decks;

  if (NEWOBJS_ != null) {
    this.decks.push(NEWOBJS_);
    this.decks[this.decks.length-1].addSlides(1);
    this.showDeckTabs(this.decks);
  }

  for (let i = 0; i < DECK_TABS.length; i++){
    DECK_TABS[i].mousePressed(SWITCHDECK);
  }


  NEWOBJS_ = null;

}

// Populate the UI
p5.SlidesUI.prototype.createSidebars = function(){
  // Create Sidebars

  SIDEBAR = createDiv();
  SIDEBAR.id('sidebar');
  SIDEBAR.size(SIDEBAR_SIZEX,height);
  SIDEBAR.position(0,0);
  SIDEBAR.style('background-color','#282828');
  SIDEBAR.style('z-index', 10);

  // resize main canvas
  MAIN_CANVAS.size(windowWidth-SIDEBAR_SIZEX,height);
  MAIN_CANVAS.position(SIDEBAR_SIZEX,0);

  EDITSIDEBAR = createDiv();
  EDITSIDEBAR.id('editbar');
  EDITSIDEBAR.parent('sidebar');
  EDITSIDEBAR.size(SIDEBAR_SIZEX,height);
  EDITSIDEBAR.position(0,0);
  EDITSIDEBAR.style('background-color','#282828');
  EDITSIDEBAR.style('z-index', 10)

  SKETCHBAR = createDiv();
  SKETCHBAR.id('sketchbar');
  SKETCHBAR.parent('sidebar');
  SKETCHBAR.size(SIDEBAR_SIZEX,height);
  SKETCHBAR.position(0,0);
  SKETCHBAR.style('background-color','#282828');
  SKETCHBAR.style('z-index', 10);
  SKETCHBAR.hide();

  TEXTBAR1 = createDiv();
  TEXTBAR1.id('textbar1');
  TEXTBAR1.parent('sidebar');
  TEXTBAR1.size(SIDEBAR_SIZEX,height);
  TEXTBAR1.position(0,0);
  TEXTBAR1.style('background-color','#282828');
  TEXTBAR1.style('z-index', 10);
  TEXTBAR1.hide();

  TEXTBAR2 = createDiv();
  TEXTBAR2.id('textbar2');
  TEXTBAR2.size(SIDEBAR_SIZEX,SIDEBAR_SIZEX/4);
  TEXTBAR2.style('background-color','transparent');
  TEXTBAR2.style('z-index', 10);
  TEXTBAR2.hide();

  DECKBAR = createDiv();
  DECKBAR.id('deckbar');
  DECKBAR.parent('sidebar');
  DECKBAR.size(SIDEBAR_SIZEX,height);
  DECKBAR.position(0,0);
  DECKBAR.style('background-color','#282828');
  DECKBAR.style('z-index', 10);
  DECKBAR.hide();

  SHAPEBAR = createDiv();
  SHAPEBAR.id('shapebar');
  SHAPEBAR.parent('sidebar');
  SHAPEBAR.size(SIDEBAR_SIZEX,height);
  SHAPEBAR.position(0,0);
  SHAPEBAR.style('background-color','#282828');
  SHAPEBAR.style('z-index', 10);
  SHAPEBAR.hide();

  // create 'edit mode' button
  EDIT_BUTTON = createImg('icons/edit-document.png');
  EDIT_BUTTON.position(0, 0);
  EDIT_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  EDIT_BUTTON.style('z-index', 11);
  EDIT_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  EDIT_BUTTON.style('opacity','0');
  EDIT_BUTTON.style('background-color','#eb7899');
  EDIT_BUTTON.hide();
  EDIT_BUTTON.mousePressed(this.editMode);
  EDIT_BUTTON.mouseOver(ON_HOVER);
  EDIT_BUTTON.mouseOut(OFF);

  // create 'present mode' button
  PRESENT_BUTTON = createImg('icons/monitor.png');
  PRESENT_BUTTON.parent('editbar');
  PRESENT_BUTTON.style('box-sizing','border-box');
  PRESENT_BUTTON.size(2*SIDEBAR_SIZEX/3,2*SIDEBAR_SIZEX/3);
  PRESENT_BUTTON.style('padding',SIDEBAR_SIZEX/6 + 'px');
  PRESENT_BUTTON.style('background-color','#eb7899');
  PRESENT_BUTTON.mousePressed(this.presentMode);

  // create new deck button
  VIEWDECKS_BUTTON = createImg('icons/slideshow-line.png');
  VIEWDECKS_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  VIEWDECKS_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  VIEWDECKS_BUTTON.parent('editbar')
  VIEWDECKS_BUTTON.style('position','absolute');
  VIEWDECKS_BUTTON.style('left','0');
  VIEWDECKS_BUTTON.style('bottom','0');
  VIEWDECKS_BUTTON.style('background-color','#eb7899');
  VIEWDECKS_BUTTON.mousePressed(TOGGLE_DECKBAR);

  NEWDECK_BUTTON = createImg('icons/text-document-add.png');
  NEWDECK_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  NEWDECK_BUTTON.parent('deckbar');
  NEWDECK_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  NEWDECK_BUTTON.style('position','absolute');
  NEWDECK_BUTTON.style('left','0');
  NEWDECK_BUTTON.style('bottom',str((SIDEBAR_SIZEX/3)) + 'px');
  NEWDECK_BUTTON.style('background-color','#6c6c6c');
  NEWDECK_BUTTON.mousePressed(NEWDECK);

  // create add slides button
  ADDSLIDE_BUTTON = createImg('icons/plus-round-line.png');
  ADDSLIDE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  ADDSLIDE_BUTTON.parent('editbar');
  ADDSLIDE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  ADDSLIDE_BUTTON.style('position','absolute');
  ADDSLIDE_BUTTON.style('left',str((SIDEBAR_SIZEX/3)) + 'px');
  ADDSLIDE_BUTTON.style('bottom','0');
  ADDSLIDE_BUTTON.style('background-color','#6c6c6c');
  ADDSLIDE_BUTTON.mousePressed(ADDSLIDE);

  // create save button
  SAVE_BUTTON = createImg('icons/save.png');
  SAVE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  SAVE_BUTTON.parent('editbar');
  SAVE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  SAVE_BUTTON.style('position','absolute');
  SAVE_BUTTON.style('right','0');
  SAVE_BUTTON.style('bottom','0');
  SAVE_BUTTON.style('background-color','#9aaab1');
  SAVE_BUTTON.mousePressed(SAVE_DECKS);

  // create button to add text to your slides
  TEXT_BUTTON = createImg('icons/text.png');
  TEXT_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  TEXT_BUTTON.parent('editbar');
  TEXT_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  TEXT_BUTTON.style('position','absolute');
  TEXT_BUTTON.style('top','0');
  TEXT_BUTTON.style('right','0');
  TEXT_BUTTON.style('background-color','#ED225D');
  TEXT_BUTTON.mousePressed(TOGGLE_TEXTBAR1);

  // create button to add text to your slides
  SHAPE_BUTTON = createImg('icons/circle.png');
  SHAPE_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  SHAPE_BUTTON.parent('editbar');
  SHAPE_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  SHAPE_BUTTON.style('position','absolute');
  SHAPE_BUTTON.style('top',SIDEBAR_SIZEX/3 + 'px');
  SHAPE_BUTTON.style('right','0');
  SHAPE_BUTTON.style('background-color','#ED225D');
  SHAPE_BUTTON.mousePressed(TOGGLE_SHAPEBAR);

  // create button to animate text
  TRANSITION_BUTTON = createImg('icons/spark.png');
  TRANSITION_BUTTON.parent('editbar');
  TRANSITION_BUTTON.id('animate');
  TRANSITION_BUTTON.size(SIDEBAR_SIZEX/6,SIDEBAR_SIZEX/6);
  TRANSITION_BUTTON.style('padding',SIDEBAR_SIZEX/12 + 'px');
  TRANSITION_BUTTON.style('position','absolute');
  TRANSITION_BUTTON.style('top',2*SIDEBAR_SIZEX/3 + 'px');
  TRANSITION_BUTTON.style('left','0');
  TRANSITION_BUTTON.style('background-color','#ED225D');
  TRANSITION_BUTTON.mousePressed(TOGGLE_TRANSITION);

  // empty button
  EMPTY_DIV = createDiv();
  EMPTY_DIV.parent('editbar');
  EMPTY_DIV.size(SIDEBAR_SIZEX/3,SIDEBAR_SIZEX/3);
  EMPTY_DIV.style('position','absolute');
  EMPTY_DIV.style('top',2*SIDEBAR_SIZEX/3 + 'px');
  EMPTY_DIV.style('right','0');
  EMPTY_DIV.style('background-color','#eb7899');

  // buttons to place sketches into the canvas
  ADDSKETCH_BUTTON = createImg('icons/p5-sq-reverse-filled.png');
  ADDSKETCH_BUTTON.size(SIDEBAR_SIZEX/4,SIDEBAR_SIZEX/4);
  ADDSKETCH_BUTTON.parent('editbar');
  ADDSKETCH_BUTTON.style('padding',SIDEBAR_SIZEX/24 + 'px');
  ADDSKETCH_BUTTON.style('position','absolute');
  ADDSKETCH_BUTTON.style('top',2*SIDEBAR_SIZEX/3 + 'px');
  ADDSKETCH_BUTTON.style('left',SIDEBAR_SIZEX/3 + 'px');
  ADDSKETCH_BUTTON.style('background-color','#ED225D');
  ADDSKETCH_BUTTON.mousePressed(TOGGLE_SKETCHBAR);

  // create & display (text) types
  let cOptions = ['#ED225D','#eb7899'];

  // header text
  TEXT_TYPES = [];
  TEXT_TYPES[0] = createButton('Header');
  TEXT_TYPES[0].id('headerbutton')
  TEXT_TYPES[0].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[0].parent('textbar1');
  TEXT_TYPES[0] = formatAllText(TEXT_TYPES[0]);
  TEXT_TYPES[0] = formatHeader(TEXT_TYPES[0]);
  TEXT_TYPES[0].style('font-size', str(2*SIDEBAR_SIZEY/3) + 'px');
  TEXT_TYPES[0].style('background-color',cOptions[1]);
  TEXT_TYPES[0].style('border','none');
  TEXT_TYPES[0].mousePressed(TEXT_HEADER);

  // subheader text
  TEXT_TYPES[1] = createButton('Subheader');
  TEXT_TYPES[1].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[1].id('subheaderbutton')
  TEXT_TYPES[1].parent('textbar1');
  TEXT_TYPES[1] = formatAllText(TEXT_TYPES[1]);
  TEXT_TYPES[1] = formatSubheader(TEXT_TYPES[1]);
  TEXT_TYPES[1].style('background-color',cOptions[0]);
  TEXT_TYPES[1].style('border','none');
  TEXT_TYPES[1].style('font-size', str(2*SIDEBAR_SIZEY/3) + 'px');
  TEXT_TYPES[1].mousePressed(TEXT_SUBHEADER);

  // body text
  TEXT_TYPES[2] = createButton('Body Text');
  TEXT_TYPES[2].size(SIDEBAR_SIZEX,2*SIDEBAR_SIZEY);
  TEXT_TYPES[1].id('bodybutton')
  TEXT_TYPES[2].parent('textbar1');
  TEXT_TYPES[2] = formatAllText(TEXT_TYPES[2]);
  TEXT_TYPES[2] = formatBody(TEXT_TYPES[2]);
  TEXT_TYPES[2].style('font-size', str(2*SIDEBAR_SIZEY/3) + 'px');
  TEXT_TYPES[2].style('background-color',cOptions[1]);
  TEXT_TYPES[2].style('border','none');
  TEXT_TYPES[2].mousePressed(TEXT_BODY);


  // create tabs to signify loaded sketch URLs
  SKETCH_TABS = [];
  let l = this.loadedSketches.length
  let y_iter = SIDEBAR_SIZEX/4;
  let path = '';
  for (let s = 0; s < l; s++) {
    if (s < 4) {
      path = 'icons/sketches/' + this.loadedSketches[s][0] + '.png';
    } else{
      path = 'icons/sketches/DefaultIcon.png';
    }
    SKETCH_TABS[s] = createImg(path) ;
    SKETCH_TABS[s].attribute('url', this.loadedSketches[s][1]);
    SKETCH_TABS[s].id('sketchtab' + s);
    SKETCH_TABS[s].position(0,(s)*y_iter);
    SKETCH_TABS[s].style('box-sizing','border-box');
    //SKETCH_TABS[s].style('background-color',cOptions[s%2]);
    SKETCH_TABS[s].mousePressed(OBJ_CHOSEN);
    SKETCH_TABS[s].size(5*SIDEBAR_SIZEX/6, y_iter);
    SKETCH_TABS[s].parent('sketchbar');
  }

  SKETCH_TABS[l] = createInput('Input your URL here');
  SKETCH_TABS[l].id('url_input')
  SKETCH_TABS[l].parent('sketchbar');
  SKETCH_TABS[l].position(0,(l)*y_iter);
  SKETCH_TABS[l].size(5*SIDEBAR_SIZEX/6, y_iter);
  SKETCH_TABS[l].style('text-align','center');
  SKETCH_TABS[l].style('box-sizing','border-box');
  SKETCH_TABS[l].mousePressed(OBJ_CHOSEN);

  SKETCH_TABS[l+1] = createImg('icons/object-selected.png');
  SKETCH_TABS[l+1].parent('sketchbar');
  let y_extent = (l+1)*y_iter;
  let x_extent = SIDEBAR_SIZEX/6;
  let x_pad = SIDEBAR_SIZEX/24;
  let s_ = x_extent- 2*x_pad;
  let y_pad = (y_extent - s_)/2;
  SKETCH_TABS[l+1].style('padding-left',x_pad + 'px');
  SKETCH_TABS[l+1].style('padding-right',x_pad + 'px');
  SKETCH_TABS[l+1].style('padding-top',y_pad + 'px');
  SKETCH_TABS[l+1].style('padding-bottom',y_pad + 'px');
  SKETCH_TABS[l+1].size(s_, s_);
  SKETCH_TABS[l+1].style('background-color','#ED225D');
  SKETCH_TABS[l+1].style('text-align','center');
  SKETCH_TABS[l+1].style('position','absolute');
  SKETCH_TABS[l+1].style('top','0');
  SKETCH_TABS[l+1].style('right','0');
  SKETCH_TABS[l+1].mousePressed(SKETCH_PLACEMENT);


  // create tabs to signify text manipulation
  // TEXT_TABS = [];
  // TEXT_TABS[0] = createImg('icons/cross-arrows.png');
  // TEXT_TABS[0].parent('textbar2');
  // TEXT_TABS[0].id('move');
  // TEXT_TABS[0].size(SIDEBAR_SIZEX/4,SIDEBAR_SIZEX/4);
  // //TEXT_TABS[0].style('padding',SIDEBAR_SIZEX/6 + 'px');
  // TEXT_TABS[0].style('box-sizing','border-box');
  // TEXT_TABS[0].style('opacity',.6);
  // TEXT_TABS[0].style('background-color',cOptions[0]);
  // TEXT_TABS[0].mousePressed(OBJ_CHOSEN);

  // create button to color text
  // TEXT_TABS[1] = createImg('icons/color-fill-tool.png');
  // TEXT_TABS[1].parent('textbar2');
  // TEXT_TABS[1].id('color');
  // TEXT_TABS[1].size(SIDEBAR_SIZEX/4,SIDEBAR_SIZEX/4);
  // TEXT_TABS[1].style('box-sizing','border-box');
  // TEXT_TABS[1].style('opacity',.6);
  // //TEXT_TABS[1].style('padding',SIDEBAR_SIZEX/6 + 'px');
  // TEXT_TABS[1].style('background-color',cOptions[1]);
  // TEXT_TABS[1].mousePressed(OBJ_CHOSEN);

  // create button to scale text (box)
  // TEXT_TABS[2] = createImg('icons/magnifying-glass-zoom.png');
  // TEXT_TABS[2].parent('textbar2');
  // TEXT_TABS[2].id('scale');
  // TEXT_TABS[2].size(SIDEBAR_SIZEX/4,SIDEBAR_SIZEX/4);
  // TEXT_TABS[2].style('box-sizing','border-box');
  // TEXT_TABS[2].style('opacity',.6);
  // //TEXT_TABS[2].style('padding',SIDEBAR_SIZEX/12 + 'px');
  // TEXT_TABS[2].style('background-color',cOptions[1]);
  // TEXT_TABS[2].mousePressed(OBJ_CHOSEN);


  // create tabs to signify shape creation
  SHAPE_TABS = [];
  SHAPE_TABS[0] = createImg('icons/circle.png');
  SHAPE_TABS[0].parent('shapebar');
  SHAPE_TABS[0].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[0].style('padding',SIDEBAR_SIZEX/16 + 'px');
  SHAPE_TABS[0].style('background-color',cOptions[0]);
  SHAPE_TABS[0].mousePressed(SHAPE_ELLIPSE);

  // create button to create rectangle
  SHAPE_TABS[1] = createImg('icons/square.png');
  SHAPE_TABS[1].parent('shapebar');
  SHAPE_TABS[1].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[1].style('padding',SIDEBAR_SIZEX/16 + 'px');
  SHAPE_TABS[1].style('background-color',cOptions[1]);
  SHAPE_TABS[1].mousePressed(SHAPE_RECT);


  // create button to create triangle
  SHAPE_TABS[2] = createImg('icons/triangle-top-arrow.png');
  SHAPE_TABS[2].parent('shapebar');
  SHAPE_TABS[2].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[2].style('padding',SIDEBAR_SIZEX/16 + 'px');
  SHAPE_TABS[2].style('background-color',cOptions[0]);
  SHAPE_TABS[2].mousePressed(SHAPE_TRIANGLE);


  // create button to create arrow
  SHAPE_TABS[3] = createImg('icons/long-arrow-left.png');
  SHAPE_TABS[3].parent('shapebar');
  SHAPE_TABS[3].size(SIDEBAR_SIZEX/8,SIDEBAR_SIZEX/8);
  SHAPE_TABS[3].style('padding',SIDEBAR_SIZEX/16 + 'px');
  SHAPE_TABS[3].style('background-color',cOptions[1]);
  SHAPE_TABS[3].mousePressed(SHAPE_ARROW);


  GOBACK_BUTTON = createImg('icons/close-round.png');
  GOBACK_BUTTON.size(2*SIDEBAR_SIZEX/12,SIDEBAR_SIZEX/6);
  GOBACK_BUTTON.style('padding-left',5*SIDEBAR_SIZEX/12 + 'px');
  GOBACK_BUTTON.style('padding-right',5*SIDEBAR_SIZEX/12 + 'px');
  GOBACK_BUTTON.style('padding-top',SIDEBAR_SIZEX/12+ 'px');
  GOBACK_BUTTON.style('padding-bottom',SIDEBAR_SIZEX/12 + 'px');
  GOBACK_BUTTON.hide();
  GOBACK_BUTTON.mousePressed(BACK_TO_SIDEBAR);
  GOBACK_BUTTON.style('position','absolute');
  GOBACK_BUTTON.style('bottom','0');
  GOBACK_BUTTON.style('background-color','#9f9498');
  GOBACK_BUTTON.style('z-index', 11);

  DECK_TABS = [];
}
p5.SlidesUI.prototype.showDeckTabs = function(decks){
  let cOptions = ['#eb7899','#6c6c6c'];
  let tabDiff = (decks.length - DECK_TABS.length);
  let tab = null;
  // add new tabs if necessary
  for (let j = tabDiff; j > 0; j--){
    tab = createButton(decks[decks.length-j].name);
    tab.id('decktab' + DECK_TABS.length);
    tab.style('z-index', 7);
    tab.parent('deckbar');
    tab.size(SIDEBAR_SIZEX,SIDEBAR_SIZEY);
    tab = formatAllText(tab);
    tab = formatHeader(tab);
    tab.style('color','#fff')
    DECK_TABS.push(tab);
  }

  for (let j = 0; j < decks.length; j++){
    DECK_TABS[j].style('background-color',cOptions[j%2]);
  }
}

// Display Modes
p5.SlidesUI.prototype.editMode = function() {
  PRESENT_BUTTON.show();
  EDIT_BUTTON.hide();
  SIDEBAR.show();
  MAIN_CANVAS.size(windowWidth - SIDEBAR_SIZEX, windowHeight);
  MAIN_CANVAS.position(SIDEBAR_SIZEX, 0);
  TOGGLED = true;
  PREVSLIDE = CURRENTSLIDE;
}
p5.SlidesUI.prototype.presentMode = function() {
  PRESENT_BUTTON.hide();
  EDIT_BUTTON.show();
  TEXTBAR2.hide();
  SIDEBAR.hide();
  TOGGLED = true;
  PREVSLIDE = CURRENTSLIDE;
  IN_OR_OUT = '';

  MAIN_CANVAS.size(windowWidth,windowHeight);
  MAIN_CANVAS.position(0,0);
}

// Effect changes (in the current display loop)
p5.SlidesUI.prototype.textResizer = function() {

  let val = null;
  let s = null;
  let w = null;
  let font = null;
  let currentText = null;


  if (this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1] !== undefined) {
    for (let j = 0; j < this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1].length; j++) {
      // j = specific bit of text
      currentText = this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][j];
      textSize(1);

      val = currentText.value();
      if (currentText.attribute('type') == 'header') {
        w = textWidth(val.toUpperCase());
      } else {
        w = textWidth(val);
      }
      s = currentText.size();
      font = min([(s.width / w)*.9, s.height*.8]);
      currentText.style('font-size', font + 'px');
      currentText.mousePressed(TOGGLE_TEXTBAR2);
    }
  }
}
p5.SlidesUI.prototype.toggleCanvases = function(){

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
    let x_off;
    let p = this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].length;
    let frame = null;
    if (SIDEBAR.style('display') == 'block') {
      x_off = SIDEBAR_SIZEX;
    } else {
      x_off = SIDEBAR_SIZEX;
    }
    let spacing = null;


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
      frame = frameRels(frame);
      frame.style('border','transparent');
      frame.style('overflow', 'hidden');
      frame.style('scrolling','no');
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
p5.SlidesUI.prototype.toggleEditText = function() {

  LOGGED_SIZES = [];

  if (SIDEBAR.style('display') == 'block') {

    let allText = this.decks[CURRENTDECK - 1].created_text;
    // hide previous text
    if (PREVSLIDE != null) {
      let text = allText[PREVSLIDE - 1];
      if (text !== undefined) {
        if (text.length != 0) {
          for (let t = 0; t < text.length; t++) {
            this.decks[CURRENTDECK - 1].created_text[PREVSLIDE - 1][t].hide();
          }
        }
      }
    }

    let textForSlide = allText[CURRENTSLIDE - 1];

    // initialize text if necessary
    if (textForSlide !== undefined) {
      if (textForSlide.length != 0) {
        for (let t = 0; t < textForSlide.length; t++) {
          this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][t].show();
          this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][t].style('z-index', 4);
        }
      }
    }
  }
}
p5.SlidesUI.prototype.togglePresentationAssets = function() {

  if (this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE - 1] !== undefined) {
    let shapes = this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE - 1];
    for (let i = 0; i < shapes.length; i++) {
      shapes[i].display();
    }
  }

  if (SIDEBAR.style('display') == 'none') {

    let currentText = null;
    if (this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1] !== undefined) {
      for (let t = 0; t < this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1].length; t++) {
        currentText = this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t];
        this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t].text = select('#' + currentText.parent).value();
        this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t].font = select('#' + currentText.parent).style('font-family');
        this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t].animation = select('#' + currentText.parent).attribute('animation');
        this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t].transitions = this.decks[CURRENTDECK - 1].transitions[CURRENTSLIDE - 1];

        // draw presentation text
        if (IN_OR_OUT != '') {
          currentText.display(false,IN_OR_OUT);
        }else if (START_ANIMATION.length != 0){
          currentText.display(START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE - 1],IN_OR_OUT);
        } else{
          currentText.display();
        }
      }
    }

    if (TOGGLED) {
      let inputText = this.decks[CURRENTDECK - 1].created_text;
      // hide input boxes
      if (PREVSLIDE != null) {
        let text = inputText[PREVSLIDE - 1];
        if (text !== undefined) {
          for (let t = 0; t < text.length; t++) {
            this.decks[CURRENTDECK - 1].created_text[PREVSLIDE - 1][t].hide();
          }
        }
      }
    }
  }
}
p5.SlidesUI.prototype.drawFromTouch = function() {
  let field = null;
  let xRatio = null;
  let yRatio = null;
  let xRel = null;
  let yRel = null;
  let label = null;

  switch (DRAW_FROM_TOUCH) {
    case 'header':
      label = 'Your header here';
      field = createElement('textarea',label);
      field = textRels(field,TRACKED_TOUCHES,true);
      field = formatAllText(field);
      field = formatHeader(field);
      this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE-1].push(field);
      this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE-1].push(new p5.PresentationAssets(field.attribute('xRelative'), field.attribute('yRelative'), field.attribute('xRatio'), field.attribute('yRatio'),DRAW_FROM_TOUCH,field.id()));
      break;

    case 'subheader':
      label = 'Your subheader here';
      field = createElement('textarea',label);
      field = textRels(field,TRACKED_TOUCHES,true);
      field = formatAllText(field);
      field = formatSubheader(field);
      this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE-1].push(field);
      this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE-1].push(new p5.PresentationAssets(field.attribute('xRelative'), field.attribute('yRelative'), field.attribute('xRatio'), field.attribute('yRatio'),DRAW_FROM_TOUCH,field.id()))
      break;


    case 'body':
      label = 'Your body text here';
      field = createElement('textarea',label);
      field = textRels(field,TRACKED_TOUCHES,true);
      field = formatAllText(field);
      field = formatBody(field);
      this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE-1].push(field);
      this.decks[CURRENTDECK - 1].presentationText[CURRENTSLIDE-1].push(new p5.PresentationAssets(field.attribute('xRelative'), field.attribute('yRelative'), field.attribute('xRatio'), field.attribute('yRatio'),DRAW_FROM_TOUCH,field.id()))
      break;


    case 'sketch':
      let frame = createElement('iframe');
      let i_ = null; // holder for sketch choice
      let id =  CHOSEN_OBJ;

      // if chosen sketch was not pre-loaded
      if (id == 'url_input'){
        i_ = this.loadedSketches.length;
        SKETCH_TABS[i_] = createButton(this.loadedSketches[this.loadedSketches.length-1][0]);
        SKETCH_TABS[i_].attribute('url', select('#' + id).value());
        SKETCH_TABS[i_].id('loaded sketch #' + i_);
        this.loadedSketches.push([SKETCH_TABS[i_].id(),select('#' + id).value()]);
        SKETCH_TABS[i_].style('border','none');
        SKETCH_TABS[i_].mousePressed(OBJ_CHOSEN);
        SKETCH_TABS[i_].size(SIDEBAR_SIZEX, SIDEBAR_SIZEY);
        SKETCH_TABS[i_].parent('sketchbar');
      } else {
        let regex = '\\d+';
        i_= match(id,regex);
        i_ = i_[0];
      }

      frame.attribute('src',this.loadedSketches[i_][1]);
      frame = frameRels(frame,TRACKED_TOUCHES);
      frame.style('box-sizing','border-box');
      frame.style('border','transparent');
      frame.style('overflow', 'hidden');
      frame.style('z-index', 1);
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1].push(frame);
      this.decks[CURRENTDECK - 1].sketches[CURRENTSLIDE - 1].push(this.loadedSketches.length);
      break;
  }

  let shapeTypes = ['ellipse','rectangle','triangle','arrow']
  if (shapeTypes.indexOf(DRAW_FROM_TOUCH) !== -1){
    let relLC_X = (TRACKED_TOUCHES[0]-MARGINS)/MAIN_CANVAS.width;
    let relLC_Y = (TRACKED_TOUCHES[1]-MARGINS)/MAIN_CANVAS.height;
    let relW = (TRACKED_TOUCHES[2]-TRACKED_TOUCHES[0])/(MAIN_CANVAS.width-2*MARGINS);
    let relH = (TRACKED_TOUCHES[3]-TRACKED_TOUCHES[1])/(MAIN_CANVAS.height-2*MARGINS);

    if (this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE-1] === undefined){
      this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE-1] = [];
    }

    OBJ = new p5.PresentationAssets(relLC_X,relLC_Y,relW,relH,DRAW_FROM_TOUCH)
    this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE-1].push(OBJ);
    this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE-1][this.decks[CURRENTDECK - 1].shapes[CURRENTSLIDE-1].length-1].display();
  }

  TRACKED_TOUCHES = '';
  UI.textResizer();
  UI.toggleCanvases();
  UI.iframeRemapper();
  UI.inputRemapper();
}

// Make elements responsive to window size
p5.SlidesUI.prototype.iframeRemapper = function(){
  // Dynamically Resize IFrames
  if (this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] === undefined) {
    this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE-1] = [];
  }


  let len = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1].length;
  let currentFrame = null;
  let xRel = null;
  let yRel = null;
  let yRatio = null;
  let xRatio = null;

  if (len != 0) {
    for (let i = 0; i < len; i++) {
      currentFrame = this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i];
      yRatio = float(currentFrame.attribute('yRatio'));
      xRatio = float(currentFrame.attribute('xRatio'));
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].size(MAIN_CANVAS.width*xRatio, MAIN_CANVAS.height*yRatio);
      xRel =  float(currentFrame.attribute('xRelative')) * MAIN_CANVAS.width;
      yRel = float(currentFrame.attribute('yRelative'))* MAIN_CANVAS.height;
      if (SIDEBAR.style('display') == 'none') {
        this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].position(xRel, yRel);
      } else {
        this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].position(SIDEBAR_SIZEX + xRel, yRel);
      }
      this.decks[CURRENTDECK - 1].canvases[CURRENTSLIDE - 1][i].style('z-index', 1);
    }
  }
}
p5.SlidesUI.prototype.inputRemapper = function() {


  let textForSlide = this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1];
  if (textForSlide !== undefined) {
    for (let t = 0; t < textForSlide.length; t++) {
      let ySize = null;
      let xSize = null;
      let xRel = null;
      let yRel = null;
      let text = null;

      text = this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][t];
      ySize = (MAIN_CANVAS.height-2*MARGINS) * float(text.attribute('yRatio'));
      xSize = (MAIN_CANVAS.width-2*MARGINS) * float(text.attribute('xRatio'));
      if (SIDEBAR.style('display') == 'none') {
        xRel = (float(text.attribute('xRelative')) * MAIN_CANVAS.width) + MARGINS;
      } else {
        xRel = SIDEBAR_SIZEX + MARGINS + (float(text.attribute('xRelative')) * MAIN_CANVAS.width);
      }
      yRel = (float(text.attribute('yRelative')) * MAIN_CANVAS.height) + MARGINS;
      this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][t].size(xSize, ySize);
      this.decks[CURRENTDECK - 1].created_text[CURRENTSLIDE - 1][t].position(xRel, yRel);

    }
  }
}

// Saving functionality
p5.SlidesUI.prototype.saveSlides = function() {

  // save JSON of current decks
  this.JSONify(this.decks);

  // save JSON of loaded sketches
  let sketchJSON = {}
  for (let i = 0; i < this.loadedSketches.length; i++) {
    sketchJSON[this.loadedSketches[i][0]] = this.loadedSketches[i][1]
  }
  saveJSON(sketchJSON, 'defaultSketches.json');

}
p5.SlidesUI.prototype.JSONify = function(deckObj){
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

      // initialize shapes object
      deckJSON[topKey][subKey]['shapes'] = {};

      // initialize created text object
      deckJSON[topKey][subKey]['createdText'] = {};

      // initialize canvas object
      deckJSON[topKey][subKey]['canvases'] = {};

      // insert background colors
      deckJSON[topKey][subKey]['bColors'] = deckObj[deck].bColors[slide];

      // insert created text
      deckJSON[topKey][subKey]['createdText'] = {};
      for (let type = 0; type < deckObj[deck].created_text.length;type++) {

        let numBoxes = deckObj[deck].created_text[slide].length;
        for (let box = 0; box < numBoxes; box++) {

          if (deckJSON[topKey][subKey]['createdText'] === undefined){
            deckJSON[topKey][subKey]['createdText'] = {};
          }

          deckJSON[topKey][subKey]['createdText'][box] = {};
          deckJSON[topKey][subKey]['createdText'][box]['yRatio'] = deckObj[deck].created_text[slide][box].attribute('yRatio');
          deckJSON[topKey][subKey]['createdText'][box]['xRatio'] =deckObj[deck].created_text[slide][box].attribute('xRatio');
          deckJSON[topKey][subKey]['createdText'][box]['xRelative'] = deckObj[deck].created_text[slide][box].attribute('xRelative');
          deckJSON[topKey][subKey]['createdText'][box]['yRelative'] =deckObj[deck].created_text[slide][box].attribute('yRelative');
          deckJSON[topKey][subKey]['createdText'][box]['text'] = deckObj[deck].created_text[slide][box].value();
          deckJSON[topKey][subKey]['createdText'][box]['type'] = deckObj[deck].created_text[slide][box].attribute('type');
          deckJSON[topKey][subKey]['createdText'][box]['id'] = deckObj[deck].created_text[slide][box].id();
          deckJSON[topKey][subKey]['createdText'][box]['animation'] = deckObj[deck].created_text[slide][box].attribute('animation');
        }
      }

      // insert canvases
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


      // insert shapes
      deckJSON[topKey][subKey]['shapes'] = {};

      if (deckObj[deck].shapes[slide] !== undefined) {
        for (let element = 0; element < deckObj[deck].shapes[slide].length; element++) {
          deckJSON[topKey][subKey]['shapes']['shape' + element] = {};
          deckJSON[topKey][subKey]['shapes']['shape' + element]['relX'] = deckObj[deck].shapes[slide][element].relX;
          deckJSON[topKey][subKey]['shapes']['shape' + element]['relY'] = deckObj[deck].shapes[slide][element].relY;
          deckJSON[topKey][subKey]['shapes']['shape' + element]['relW'] = deckObj[deck].shapes[slide][element].relW
          deckJSON[topKey][subKey]['shapes']['shape' + element]['relH'] = deckObj[deck].shapes[slide][element].relH;
          deckJSON[topKey][subKey]['shapes']['shape' + element]['type'] = deckObj[deck].shapes[slide][element].type;
        }
      }

      // insert presentation text
      deckJSON[topKey][subKey]['presentationText'] = {};

      if (deckObj[deck].presentationText[slide] !== undefined) {
        for (let element = 0; element < deckObj[deck].presentationText[slide].length; element++) {
          deckJSON[topKey][subKey]['presentationText']['text' + element] = {};
          deckJSON[topKey][subKey]['presentationText']['text' + element]['relX'] = deckObj[deck].presentationText[slide][element].relX;
          deckJSON[topKey][subKey]['presentationText']['text' + element]['relY'] = deckObj[deck].presentationText[slide][element].relY;
          deckJSON[topKey][subKey]['presentationText']['text' + element]['relW'] = deckObj[deck].presentationText[slide][element].relW
          deckJSON[topKey][subKey]['presentationText']['text' + element]['relH'] = deckObj[deck].presentationText[slide][element].relH;
          deckJSON[topKey][subKey]['presentationText']['text' + element]['type'] = deckObj[deck].presentationText[slide][element].type;
          deckJSON[topKey][subKey]['presentationText']['text' + element]['parent'] = deckObj[deck].presentationText[slide][element].parent;
        }
      }

    }
  }

  saveJSON(deckJSON, 'myDecks.json');
}
p5.SlidesUI.prototype.unpackJSON = function(JSON) {
  let myDecks = [];

  let keys = (Object.keys(JSON));
  for (let deck = 0; deck < keys.length; deck++) {
    let firstIndex = keys[deck];
    myDecks[deck] = new p5.SlideDeck(firstIndex);

    let secondKeys = Object.keys(JSON[firstIndex]);
    for (let key2_ = 0; key2_ < secondKeys.length; key2_++)
      if (match(secondKeys[key2_],'slide')) {
        let regex = '\\d+';
        let slideNum = int(match(secondKeys[key2_],regex));
        let tertiaryKeys = Object.keys(JSON[firstIndex][secondKeys[key2_]]);
        for (let key3_ = 0; key3_ < tertiaryKeys.length; key3_++){

          // load background colors
          if (match(tertiaryKeys[key3_], 'bColors')) {
            myDecks[deck][tertiaryKeys[key3_]][slideNum] = color(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
          }

          // load created text

          else if (match(tertiaryKeys[key3_], 'createdText')) {
            myDecks[deck].created_text[slideNum] = [];
            let boxes = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            for (let box = 0; box < boxes.length; box++) {
              let textToPlace = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][boxes[box]];
              let thisText = createElement('textarea', textToPlace['text']);
              thisText.attribute('type', textToPlace['type']);
              thisText = formatAllText(thisText);
              if (thisText.attribute('type') == 'header'){
                thisText = formatHeader(thisText)
              } else if (thisText.attribute('type') == 'subheader'){
                thisText = formatSubheader(thisText)
              } else if (thisText.attribute('type') == 'body'){
                thisText = formatBody(thisText)
              }
              thisText.attribute('xRatio', textToPlace['xRatio']);
              thisText.attribute('yRatio', textToPlace['yRatio']);
              thisText.attribute('xRelative', textToPlace['xRelative']);
              thisText.attribute('yRelative', textToPlace['yRelative']);
              thisText.id(textToPlace['id']);
              if (textToPlace['animation'] != null) {
                thisText.attribute('animation', textToPlace['animation']);
              }
              thisText.hide();
              myDecks[deck].created_text[slideNum].push(thisText);
            }


            // load canvases

          } else if (match(tertiaryKeys[key3_], 'canvases')) {

            let frames = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            myDecks[deck].canvases[slideNum] = [];

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
              thisFrame.style('scrolling','no');
              thisFrame.style('z-index', 1);
              thisFrame.hide();
              myDecks[deck].canvases[slideNum].push(thisFrame);
            }
          } else if (match(tertiaryKeys[key3_], 'shapes')) {

            let shapes = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            myDecks[deck].shapes[slideNum] = [];

            for (let shape = 0; shape < shapes.length; shape++) {
              let selectedShape = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][shapes[shape]];
              let thisShape = new p5.PresentationAssets(selectedShape['relX'],selectedShape['relY'],selectedShape['relW'],selectedShape['relH'],selectedShape['type']);
              myDecks[deck].shapes[slideNum].push(thisShape);
            }
          } else if (match(tertiaryKeys[key3_], 'presentationText')) {

            let texts = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            myDecks[deck].presentationText[slideNum] = [];

            for (let text = 0; text < texts.length; text++) {
              let selectedText = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][texts[text]];
              let thisText = new p5.PresentationAssets(selectedText['relX'],selectedText['relY'],selectedText['relW'],selectedText['relH'],selectedText['type'],selectedText['parent']);
              myDecks[deck].presentationText[slideNum].push(thisText);
            }
          } else if (match(tertiaryKeys[key3_], 'transitions')) {

            let transitions = Object.keys(JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]]);
            myDecks[deck].transitions[slideNum] = [];

            for (let t = 0; t < transitions.length; t++) {
              let selectedT = JSON[firstIndex][secondKeys[key2_]][tertiaryKeys[key3_]][transitions[t]];
              myDecks[deck].transitions[slideNum] = selectedT;
            }
          }
        }
      }else {
        myDecks[deck][secondKeys[key2_]] = JSON[firstIndex][secondKeys[key2_]];
      }
  }
  this.decks = myDecks;
  return;
}

// =============================================================================
//                                  p5.SlideDeck
// =============================================================================
/**
 * Base class for a single slide deck
 *
 * @class p5.SlideDeck
 * @constructor
 */

p5.SlideDeck = function(name) {

  if (MARGINS !== null){
    this.margins = MARGINS;
  } else {
    this.margins = MAIN_CANVAS.width/24;
  }
  this.name = name;
  this.sketches = []; // initialize the sketch array
  this.deckLength = 0;
  this.templates = [];
  this.headings = [];
  this.subheadings = [];
  this.created_text = [];
  this.currentSlide = 1;
  this.presentationText = [];
  this.transitions = [];
  this.transitions[CURRENTSLIDE-1] = {};
  this.shapes = [];
  this.canvases = [];
  this.bColors = [];
  this.colorOptions = ['#ffffff', '#ED225D'];
}

p5.SlideDeck.prototype.slideTemplates = function(slide) {


  let template = this.templates[slide];
  let header = this.headings[slide];
  let subheader = this.subheadings[slide];
  let corners = [];

  // Determine header length for automatic sizing
  if (template == 'full-text') {

    // header
    let H = createElement('textarea',header);
    corners[0] = 0;
    corners[1] = (MAIN_CANVAS.height/4);
    corners[2] = corners[0] + (MAIN_CANVAS.width);
    corners[3] = corners[1] + ((MAIN_CANVAS.height)/3);
    H = textRels(H,corners);
    H = formatAllText(H);
    H = formatHeader(H);
    H.hide();

    this.created_text[slide].push(H);
    this.presentationText[slide].push(new p5.PresentationAssets(H.attribute('xRelative'),H.attribute('yRelative'),H.attribute('xRatio'),H.attribute('yRatio'),'header',H.id()));

    // subheader
    let S = createElement('textarea',subheader);
    corners[0] = 0;
    corners[1] = corners[1] + (MAIN_CANVAS.height/4);
    corners[2] = corners[0] + (MAIN_CANVAS.width);
    corners[3] = corners[1] + ((MAIN_CANVAS.height)/12);
    S = textRels(S,corners);
    S = formatAllText(S);
    S = formatSubheader(S);
    S.hide();
    this.created_text[slide].push(S);
    this.presentationText[slide].push(new p5.PresentationAssets(S.attribute('xRelative'),S.attribute('yRelative'),S.attribute('xRatio'),S.attribute('yRatio'),'subheader',S.id()));

    // image
    let img = createImg('icons/p5-asterisk.png');
    img.size(MAIN_CANVAS.height,MAIN_CANVAS.height);
    img.style('opacity',.2);
    img.style('pointer-events','none');
    img.position(SIDEBAR_SIZEX + MAIN_CANVAS.width-MAIN_CANVAS.height,0);
  }

  if (template == 'low-header') {

    // subheader
    let S = createElement('textarea',subheader);
    corners[0] = 0;
    corners[1] = 9*MAIN_CANVAS.height/12;
    corners[2] = corners[0] + (MAIN_CANVAS.width);
    corners[3] = 10*MAIN_CANVAS.height/12;
    S = textRels(S,corners);
    S = formatAllText(S);
    S = formatSubheader(S);
    S.hide();
    this.created_text[slide].push(S);
    this.presentationText[slide].push(new p5.PresentationAssets(S.attribute('xRelative'),S.attribute('yRelative'),S.attribute('xRatio'),S.attribute('yRatio'),'subheader',S.id()));

    // header

    let H = createElement('textarea',header);
    corners[0] = 0;
    corners[3] = corners[1];
    corners[1] = corners[1] - ((MAIN_CANVAS.height)/12);
    corners[2] = corners[0] + (MAIN_CANVAS.width);
    H = textRels(H,corners);
    H = formatAllText(H);
    H = formatHeader(H);
    H.hide();

    this.created_text[slide].push(H);
    this.presentationText[slide].push(new p5.PresentationAssets(H.attribute('xRelative'),H.attribute('yRelative'),H.attribute('xRatio'),H.attribute('yRatio'),'header',H.id()));

    Y_BOUNDS = [0, corners[1] - MARGINS];
  }
}

p5.SlideDeck.prototype.addSlides = function(num) {
  // add new slide to SlideDeck object

  let len = this.deckLength;
  for (let j = len; j < len + num; j++) {
    this.presentationText[j] = [];
    this.created_text[j] = [];
    this.transitions[j] = {'in':'', 'out':''};
    START_ANIMATION[CURRENTDECK-1][j] = {'in':'', 'out':''};
    START_ANIMATION[CURRENTDECK-1][j+1] = {'in':'', 'out':''};

    // define template creation order
    if (j == 1){
      this.sketches[j] = [0]; //[blankSketch]; //
      this.templates[j] = 'low-header';
      this.headings[j] = 'Showcase Mode';
      this.subheadings[j] = 'Show off a single sketch';
    } else if (j == 0) {
      this.sketches[j] = []; //[blankSketch]; //
      this.templates[j] = 'full-text';
      this.headings[j] = 'P5.SLIDES';
      this.subheadings[j] = 'INTERACTIVE PRESENTATIONS FOR THE WEB';
    } else if (j > 2) {
      this.sketches[j] = [];
      this.templates[j] = 'full-sketch';
      this.headings[j] = '';
      this.subheadings[j] = '';
    } else if (j == 2) {
      this.sketches[j] = [1,2,1];
      this.templates[j] = 'low-header';
      this.headings[j] = 'Panel Mode';
      this.subheadings[j] = 'Expand your visual repertoire';
    }

    this.bColors[this.deckLength] = this.colorOptions[0];
    this.slideTemplates(this.deckLength);
    this.deckLength += 1;
  }
}

// =============================================================================
//                              p5.PresentationAssets
// =============================================================================

/**
 * Base class for P5 elements displayed during Presentation Mode
 *
 * @class p5.PresentationAssets
 * @constructor
 */

p5.PresentationAssets = function(relX,relY,relW,relH,type,parent) {
  this.relX = relX;
  this.relY = relY;
  this.relW = relW;
  this.relH = relH;
  this.type = type;
  if (parent !== undefined) {
    this.parent = parent;
  }
  this.text = null;
  this.font = null;
  this.color = color('#ED225D');
  this.transitions = {};
  this.animation = null;
  this.toTransition = '';
  this.animatedObjects = [];
  this.startTime = null;
  this.nextPos = null;
}
p5.PresentationAssets.prototype.display = function(animate) {

  let lX = (this.relX * MAIN_CANVAS.width) + MARGINS;
  let lY = (this.relY * MAIN_CANVAS.height) + MARGINS;
  let w = this.relW * (MAIN_CANVAS.width - 2 * MARGINS);
  let h = this.relH * (MAIN_CANVAS.height - 2 * MARGINS);
  let a = atan2(h, w);

  push();
  translate(lX, lY);

  let shapes = ['ellipse', 'rectangle', 'triangle', 'arrow'];
  let texts = ['header', 'subheader', 'body'];
  if (shapes.indexOf(this.type) !== -1) {
    noStroke();
    fill(this.color);

    switch (this.type) {
      case ('rectangle'):
        rect(0, 0, w, h);
        break;

      case ('ellipse'):
        ellipse(w / 2, h / 2, abs(w), abs(h));
        break;

      case ('triangle'):
        let d = int(dist(lX, lY, abs(lX + w), abs(lY + h)));
        let x = (d / (sqrt(3)));
        rotate(a);
        triangle(0, 0, d, x, d, -x);
        break;


      case ('arrow'):
        rotate(a);
        let d_tot = int(dist(lX, lY, lX + w, lY + h));
        let d_tri = (d_tot / 3);
        let x_tri = (d_tri / (sqrt(3)));
        triangle(0, 0, d_tri, x_tri, d_tri, -x_tri);
        rect(d_tri, x_tri / 3, d_tot, -2 * x_tri / 3);
        break;
    }
  } else if (texts.indexOf(this.type) !== -1) {

    switch (this.type) {
      case('header'):
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        fill('#ED225D');
        stroke('#ED225D');
        strokeWeight(1);
        break;


      case ('subheader'):
        textAlign(LEFT, TOP);
        fill('#6c6c6c');
        stroke('#6c6c6c');
        strokeWeight(1);
        textStyle(ITALIC);
        break;


      case ('body'):
        textStyle(NORMAL);
        textAlign(LEFT, TOP);
        fill('#282828');
        stroke('#282828');
        break;
    }

    let t = null;
    let tW = null;
    if (this.type == 'header') {
      t = this.text.toUpperCase()
      tW = textWidth(t);
      this.fontSize = min([(w / tW) * .9, h * .8]);
      textFont(FONTS[0]);
    } else {
      t = this.text;
      tW = textWidth(t);
      this.fontSize = min([(w / tW) * .9, h * .8]);
      textFont(this.font);
    }
    textSize(this.fontSize);

    if (IN_OR_OUT == '') {
      text(t, 0, 0);
    }
  }

  pop();

  // do transitions
  let t = null;
  this.transitions = START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE-1][IN_OR_OUT];

  switch (this.transitions) {
    case (''):
      if (IN_OR_OUT == 'in') {
        this.startTime = null;
        IN_OR_OUT = '';
        this.toTransition = '';
        this.animatedObjects = [];
      }else if (IN_OR_OUT == 'out') {
        if (PREVSLIDE != CURRENTSLIDE || CURRENTSLIDE == 1) {
          PREVSLIDE = CURRENTSLIDE;
          CURRENTSLIDE++;
        }
        TOGGLED = true;
        this.toTransition = 'in';
        IN_OR_OUT = 'in';
        this.startTime = millis();
        this.animatedObjects = [];
      }

    case ('particles'):
      if (this.animatedObjects.length == 0) {
        if (this.type == 'header') {
          t = this.text.toUpperCase();
        } else {
          t = this.text;
        }
        textAlign(LEFT, TOP);
        let points = FONTS[0].textToPoints(t, lX, lY + this.fontSize, this.fontSize);
        if (IN_OR_OUT == 'in') {
          this.animatedObjects = [];
          for (let p = 0; p < points.length; p++) {
            this.animatedObjects[p] = {};
            this.animatedObjects[p].homeX = points[p].x;
            this.animatedObjects[p].homeY = points[p].y;
            this.animatedObjects[p].x = 0;
            this.animatedObjects[p].y = 0;
          }
        }else{
          this.animatedObjects = points;
        }
      } else if ((IN_OR_OUT != '') && (this.animatedObjects.length != 0)) {

        if (abs(this.startTime - millis()) < 3000) {
          this.particleDraw(IN_OR_OUT);
        } else if ((abs(millis()-this.startTime) > 1000) && IN_OR_OUT == 'out') {
          PREVSLIDE = CURRENTSLIDE;
          CURRENTSLIDE++;
          TOGGLED = true;
          IN_OR_OUT = 'in';
          this.startTime = millis();
          this.animatedObjects = [];
        } else if ((abs(millis()-this.startTime) > 1000) && IN_OR_OUT == 'in') {
          this.startTime = null;
          IN_OR_OUT = '';
          this.animatedObjects = [];
        }
      }
  }
}
p5.PresentationAssets.prototype.particleDraw = function(movement) {
  for (let p = 0; p < this.animatedObjects.length; p++) {

    // // Initialize particle variables
    // if (this.animatedObjects[p].noiseStart === undefined){
    //   this.animatedObjects[p].noiseStart = random(0,1000);
    // }
    if (this.animatedObjects[p].ax === undefined) {
      if (movement == 'out') {
        this.animatedObjects[p].ax = 0;
        this.animatedObjects[p].ay = .5;
      } else {
        this.animatedObjects[p].ax = this.animatedObjects[p].homeX - this.animatedObjects[p].x;
        this.animatedObjects[p].ay = this.animatedObjects[p].homeY - this.animatedObjects[p].y;
      }
    }

    if (this.animatedObjects[p].vx === undefined){
      this.animatedObjects[p].vx = 0;
      this.animatedObjects[p].vy = 0;
    }

    ellipse(this.animatedObjects[p].x,this.animatedObjects[p].y,(MAIN_CANVAS.height/100));


    this.animatedObjects[p].vx += this.animatedObjects[p].ax;
    this.animatedObjects[p].vy += this.animatedObjects[p].ay;
    this.animatedObjects[p].x += this.animatedObjects[p].vx;
    this.animatedObjects[p].y += this.animatedObjects[p].vy;

    if (this.animatedObjects[p].y >= MAIN_CANVAS.height){
      this.animatedObjects[p].vy = -(1*this.animatedObjects[p].vy/3);
    }
    if (this.animatedObjects[p].x >= MAIN_CANVAS.width){
      this.animatedObjects[p].vx = -(1*this.animatedObjects[p].vx/3);
    }
  }
}

// =============================================================================
//                      Functions that Govern Button Functionality
// =============================================================================


// Navigation
function keyReleased() {
  if ((key === 'ArrowRight') && (CURRENTSLIDE < MAXSLIDE)) {

    if (SIDEBAR.style('display') == 'none') {
      let currentText = DECKS[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1];

      if (START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE-1]['out'] != '') {
        for (let t = 0; t < currentText.length; t++) {
          DECKS[CURRENTDECK - 1].presentationText[CURRENTSLIDE - 1][t].startTime = millis();
          IN_OR_OUT = 'out';
          TOGGLED = true;
        }
      }else {
        PREVSLIDE = CURRENTSLIDE;
        CURRENTSLIDE++;
        TOGGLED = true;
      }
    } else{
      PREVSLIDE = CURRENTSLIDE;
      CURRENTSLIDE++;
      TOGGLED = true;
    }
  } else if ((key === 'ArrowLeft')) {
    if ((CURRENTSLIDE > 1)) {
      PREVSLIDE = CURRENTSLIDE;
      CURRENTSLIDE--;
      TOGGLED = true;
      IN_OR_OUT = '';
      // for (let t = 0; t < currentText.length; t++) {
      //   currentText[t].toAnimate = false;
      // }
    }
  }
}
function SWITCHDECK() {
  let ID_ = this.id();
  let regexp = '\\d+';
  ID_ = match(ID_, regexp);
  CURRENTDECK = int(ID_);
  CURRENTSLIDE = 1;
  TOGGLED = true;
  PREVSLIDE = null;
  Y_BOUNDS = [];
  X_BOUNDS = [];
}

// Edit Button
function ON_HOVER() {
  this.style('opacity','.3');
}
function OFF() {
  this.style('opacity','0');
}

// Go Back to Main Sidebar
function BACK_TO_SIDEBAR() {
  SKETCHBAR.hide();
  TEXTBAR1.hide();
  TEXTBAR2.hide();
  DECKBAR.hide();
  SHAPEBAR.hide();
  EDITSIDEBAR.show();
  GOBACK_BUTTON.hide();
}

// Toggle Alternative Sidebars
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
  let tb2 =  select('#textbar2');
  tb2.position(this.x,this.y - tb2.height);
  tb2.attribute('currentText',this.id());
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
function TOGGLE_TRANSITION() {
  START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE] = {};
  START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE]['in'] = 'particles';
  START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE]['out'] = '';
  START_ANIMATION[CURRENTDECK - 1][CURRENTSLIDE - 1]['out'] = 'particles';
}


// Trigger Events when Objects are Chosen
function OBJ_CHOSEN() {

  if (CHOSEN_OBJ != null){
    select('#' + CHOSEN_OBJ).style('border','none');
  }

  CHOSEN_OBJ = this.id();
  let ids = ['move','color','scale','animate'];
  if (ids.indexOf(CHOSEN_OBJ) !== -1) {
    let tb2 =  select('#textbar2');
    let text = select('#' + tb2.attribute('currentText'));

    if (CHOSEN_OBJ == ids[0]){
      // text.position(tb2.position().x,tb2.position().y + tb2.height);
      // text = textRels(text,[mouseX + SIDEBAR_SIZEX,mouseY,mouseX+ SIDEBAR_SIZEX+ text.width,mouseY+ text.height]);
      // tb2.position(text.x,text.y - tb2.height);
    } else if (CHOSEN_OBJ == ids[1]){
      text.style('color','#000');
    } else if (CHOSEN_OBJ == ids[2]){
      // text.size(text.width + (text.x - mouseX),text.height + (text.y - mouseY));
      // text = textRels(text,[text.x,text.y,text.x + text.width,text.y + text.height]);
    } else if (CHOSEN_OBJ == ids[3]){
      text.attribute('animation', 'particles');
    }
  }

  this.style('border','solid');
  this.style('border-color','#aeaeae');
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
  NEWOBJS_ = new p5.SlideDeck('Deck ' + NUMDECKS);
}

// Draw from Touch (labels)
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

// Draw from Touch (functions)
function touchStarted(){
  if (TRACKED_TOUCHES == 'onstart') {
    TRACKED_TOUCHES = [mouseX,mouseY];
  }
}
function drawShapeOutlines(){
  if (TRACKED_TOUCHES.length == 2) {
    noFill();
    let c = color('#ED225D');
    strokeWeight(5);
    stroke(c);
    let rects = ['header', 'subheader', 'body', 'sketch', 'rectangle'];
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
      triangle(0, 0,d, x,d, -x);

    } else if (DRAW_FROM_TOUCH == 'arrow') {
      rotate(a);
      let d_tot = int(dist(TRACKED_TOUCHES[0], TRACKED_TOUCHES[1], mouseX, mouseY));
      let d_tri = (d_tot / 3);
      let x_tri = (d_tri / (sqrt(3)));
      triangle(0, 0,d_tri, x_tri,d_tri, -x_tri);
      rect(d_tri,x_tri/3,d_tot,-2*x_tri/3);
    }
    endShape(CLOSE);
    pop();
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

// Text Formatting
function formatHeader(t) {
  t.style('text-transform', 'uppercase');
  t.attribute('type', 'header');
  t.style('font-weight', 'bold');
  t.style('font-family', 'Inconsolata','monospace');
  t.style('color', '#ED225D')
  t.style('z-index', 4);
  return t
}
function formatSubheader(t) {
  t.style('font-style', 'italic');
  t.attribute('type', 'subheader');
  t.style('font-family', 'sans-serif')
  t.style('z-index', 3);
  t.style('color','#6c6c6c')

  return t
}
function formatBody(t) {
  t.attribute('type', 'body');
  t.style('color','#282828');
  t.style('font-family', 'times')
  t.style('z-index', 2);

  return t
}
function formatAllText(t) {
  let id_ = 'text' + TEXTCOUNT;
  t.id(id_);
  t.style('border', 'none');
  t.style('overflow', 'hidden');
  t.style('box-sizing','border-box');
  t.style('wrap', 'hard');
  t.style('background-color', 'transparent');
  t.style('text-align', 'left');
  TEXTCOUNT++;

  return t
}

// Resizing Functions
function windowResized() {
  if (SIDEBAR.style('display') == 'block') {
    //SIDEBAR_SIZEX = windowWidth/6;
    MAIN_CANVAS.size(windowWidth-SIDEBAR_SIZEX, windowHeight);
    MAIN_CANVAS.position(SIDEBAR_SIZEX, 0);
  } else {
    MAIN_CANVAS.size(windowWidth, windowHeight);
    MAIN_CANVAS.position(0, 0);
  }

  let ids = ['sidebar','editbar','sketchbar', 'textbar1', 'textbar2', 'deckbar','shapebar'];
  for (i = 0; i < ids.length; i++) {
    select('#' + ids[i]).size(SIDEBAR_SIZEX,windowHeight);
  }

  UI.textResizer();
  UI.toggleCanvases();
  UI.iframeRemapper();
  UI.inputRemapper();
}
function frameRels(frame,touches){

  if (touches === undefined) {
    frame.attribute('xRatio', frame.width / MAIN_CANVAS.width);
    frame.attribute('yRatio', frame.height / MAIN_CANVAS.height);
    frame.attribute('xRelative', (frame.position().x - SIDEBAR_SIZEX) / MAIN_CANVAS.width);
    frame.attribute('yRelative', (frame.position().y) / MAIN_CANVAS.height);
  } else{
    frame.attribute('xRatio',abs(touches[2]-touches[0])/MAIN_CANVAS.width);
    frame.attribute('yRatio',abs(touches[3]-touches[1])/MAIN_CANVAS.height);
    frame.attribute('xRelative',min(touches[0],touches[2])/MAIN_CANVAS.width);
    frame.attribute('yRelative',min(touches[1],touches[3])/MAIN_CANVAS.height);
  }

  return frame
}
function textRels(text, corners,flag){

  if (flag) {
    text.attribute('xRatio', abs(corners[2] - corners[0]) / (MAIN_CANVAS.width-2*MARGINS));
    text.attribute('yRatio', abs(corners[3] - corners[1]) / (MAIN_CANVAS.height-2*MARGINS));
    text.attribute('xRelative', (min(corners[0], corners[2]) - MARGINS) / MAIN_CANVAS.width);
    text.attribute('yRelative', (min(corners[1], corners[3]) - MARGINS) / MAIN_CANVAS.height);
  } else{
    text.attribute('xRatio', abs(corners[2] - corners[0]) / MAIN_CANVAS.width);
    text.attribute('yRatio', abs(corners[3] - corners[1]) / MAIN_CANVAS.height);
    text.attribute('xRelative', min(corners[0], corners[2]) / MAIN_CANVAS.width);
    text.attribute('yRelative', min(corners[1], corners[3]) / MAIN_CANVAS.height);
  }

  return text

}