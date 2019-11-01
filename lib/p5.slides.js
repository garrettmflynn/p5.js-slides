/**
     * Base class for a slide deck
     *
     * @class p5.SlideDeck
     * @constructor
     */

p5.SlideDeck = function() {
      //
      // this object creates a slide deck
      //

      this.deckLength = 0; // initialize the slide array
      this.sketches = []; // initialize the sketch array
      this.templates = [];
      this.margins = [];
      this.headings = [];
      this.subheadings = [];
      this.numPanels = [];
      this.panelLayouts = [];
      this.labelVecs = [];
      this.currentSlide = 1;
      this.active = 0;
      this.xBounds = [];
      this.bColors = [];
      this.colorOptions = [color(0,0,0),color(255,255,255)];
      this.navMode = 'numbers';
  
      if (this.navMode == 'numbers'){
        this.prevKey = key;
        key = 1;
      }
  
  console.log(key);
       
      // Populate active sketches but remove immediately
      this.active = new p5(blueRect, "myContainer");
      this.toggled = true;
  
  
    };     // end p5.SlideDeck constructor



// 

// TEMPLATE CHARACTERISTICS
function slideTemplates(template,header,subheading,nPanels, labels, margins,textColor){
  
  // Determine header length for automatic sizing
  let headerLength = header.length;
  
if (template == 'full-text'){
  let headerSize = 1.75*width/(headerLength);  
  let headerWords = split(header, ' ');
  
  console.log(headerWords);
  
    
  let word;
  let lineLength = 0;
  
  for (i = 0; i < headerWords-1; i++){
    word = headerWords[i];
    lineLength += word.length;
    
    if (lineLength + headerWords[i+1].length >
    
  }
  
  
  
  
  textColor.setAlpha(100);
  fill(textColor);
  stroke(textColor);
  textStyle(ITALIC);
  textAlign(LEFT, BOTTOM);
  textSize(headerSize/2);
  text(subheading,margins,(height - margins));

    
  textColor.setAlpha(255);  
  fill(textColor);
  stroke(textColor);
  textAlign(LEFT, BOTTOM);
  textStyle(BOLD);
  textSize(headerSize);
  let headerStart = (height - margins - headerSize);
  text(header,margins,headerStart);

}
  
if (template == 'full-sketch'){

}
  
  
  
  if (template == 'mid-title'){
  let headerSize = 1.75*width/(headerLength);  
  textColor.setAlpha(100);
  fill(textColor);
  stroke(textColor);
  textStyle(ITALIC);
  textAlign(LEFT, TOP);
  textSize(headerSize/2);
  text(subheading,margins,(height/2 + margins));

    
  textColor.setAlpha(255);  
  fill(textColor);
  stroke(textColor);
  textAlign(LEFT, BOTTOM);
  textStyle(BOLD);
  textSize(headerSize);
  let headerStart = (height/2 - margins);
  text(header,margins,headerStart);

}
  
  if (template == 'low-header'){
  let headerSize = 1.75*width/(2*headerLength);
    
  textColor.setAlpha(100);
  fill(textColor);
  stroke(textColor);
  textStyle(ITALIC);
  textAlign(LEFT, BOTTOM);
  textSize(headerSize/2);
  text(subheading,margins,(height - margins));

    
  textColor.setAlpha(255);  
  fill(textColor);
  stroke(textColor);
  textAlign(LEFT, BOTTOM);
  textStyle(BOLD);
  textSize(headerSize);
  let headerStart = (height - margins - headerSize);
  text(header,margins,headerStart);

}
  
}





// CREATE SLIDE ELEMENTS
p5.SlideDeck.prototype.addSlides = function (num) {
  // add new slide to SlideDeck object

  for (i = 0; i < num; i++){
  this.sketches[this.deckLength + (i+1)] = [];
  this.margins[this.deckLength + (i+1)] = 0;
  this.templates[this.deckLength + (i+1)] = 'low-title';
    this.headings[this.deckLength + (i+1)] = 'Your Heading Here';
     this.subheadings[this.deckLength + (i+1)] = 'Your Subheading Here';
      this.numPanels[this.deckLength + (i+1)] = 1;
     this.panelLayouts[this.deckLength + (i+1)] = 'horizontal';
      this.labelVecs[this.deckLength + (i+1)] = 'Your Label Here';
    
  //let options = [0,1];
  //let choice = random(options);
    let choice = 0;
    
  this.bColors[this.deckLength + (i+1)] = this.colorOptions[choice];  
  }
  
  this.deckLength += num;
}

p5.SlideDeck.prototype.addSketches = function (slide,sketchVec) {
  // assign sketches to slides in SlideDeck object
  
  
  this.sketches[slide-1] = sketchVec;
}



// SLIDE CHARACTERISTICS

p5.SlideDeck.prototype.setTemplate = function (slide,template) {
  // assign headings to slides in SlideDeck object
  
  this.templates[slide-1] = template;
}

p5.SlideDeck.prototype.setHeading = function (slide,heading) {
  // assign headings to slides in SlideDeck object
  
  this.headings[slide-1] = heading;
}

p5.SlideDeck.prototype.setSubheading = function (slide,subheading) {
  // assign subheadings to slides in SlideDeck object
  
  this.subheadings[slide-1] = subheading;
}

p5.SlideDeck.prototype.panelConfig = function (slide,numPanels,layout,labels) {
  // configure panels for slides in SlideDeck object
  
  this.numPanels[slide-1] = numPanels;
  this.panelLayouts[slide-1] = layout;
  this.labelVecs[slide-1] = labels;
}



p5.SlideDeck.prototype.setMargins = function (slide,marginSize) {
  // assign margin sizes to slides in SlideDeck object
  
  this.margins[slide-1] = marginSize;
}


p5.SlideDeck.prototype.setNavMode = function (navMode) {
  // assign margin sizes to slides in SlideDeck object
  
  this.navMode = navMode;
}



// PRESENTATION MODE
p5.SlideDeck.prototype.playCurrentSlide = function () {

  // navigate to different slide if necessary
  if (this.navMode == 'arrows'){
  this.next();
  this.previous();
  } else if (this.navMode == 'numbers'){
  this.select();
  }
  
  // define complementary colors for background and text
  background(this.bColors[this.currentSlide]); 
  let colorOpposite;
  if (this.bColors[this.currentSlide] == 1){
    colorOpposite = this.colorOptions[0];
  } else{
    colorOpposite = this.colorOptions[1];
  }

  slideTemplates(this.templates[this.currentSlide-1],this.headings[this.currentSlide-1],this.subheadings[this.currentSlide-1],this.numPanels[this.currentSlide-1],this.labelVecs[this.currentSlide-1],this.margins[this.currentSlide-1],colorOpposite);
  
  if (this.toggled == true){
    
   // clear previous sketches 

  this.active.remove();
    
  // place new sketches
  let sketchesForSlide = this.sketches[this.currentSlide-1];

    let p = this.numPanels[this.currentSlide];
    
  for (i = 0; i < p; i++){
    
      //this.xBounds = [(i)*width/p,(i+1)*width/p];
    
      //this.active = new p5(sketchesForSlide[i], "myContainer");
    this.active = new p5(sketchesForSlide[i], "myContainer");
  } 
    
    this.toggled = false;
  }
  
  
  
}

// SLIDE NAVIGATION
p5.SlideDeck.prototype.select = function () {
  // select slide using number keys
  if ((key > 0) && (key <= this.deckLength) && (this.prevKey != key)){
  this.currentSlide = key;
  this.toggled = true;
  this.prevKey = key;
  //key =  '';
}
}


p5.SlideDeck.prototype.previous = function () {
  // move back one slide
  if (((this.currentSlide-1) > 0) && (key == 'ArrowLeft')){
  this.currentSlide--;
  this.toggled = true;
  key =  '';
}
}

p5.SlideDeck.prototype.next = function () {
  // move forward one slide
  
if ((this.currentSlide != this.deckLength ) && (key == 'ArrowRight')){
    
  this.currentSlide++;
  this.toggled = true;
  key =  '';
    
}
}
;