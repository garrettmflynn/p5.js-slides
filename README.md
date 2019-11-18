
# [**p5.slides**](https://github.com/GarrettMFlynn/p5.js-slides)
**p5.slides** is a [p5.js](https://p5js.org/) application for the design of custom slide decks with dynamic content. You may find this useful for everything from class presentations to professional keynotes.

 ![Gif Example](img/workflow.gif)
 **Created by** Garrett Flynn (gflynn@usc.edu) at the University of Southern California

 
 ## Getting Started
 
 ### Setup 
 
 1. Link to the application in your HTML file:
         
         <script src="https://garrettmflynn.github.io/p5.js-slides/lib/p5.slides.js"></script>)
         
 2. Paste the following code into your main sketch:
        
        
        let sketches = {};
        let myDecks = {};
          
        // LOAD OLD DATA
        function preload() {
         sketches = loadJSON('defaultSketches.json');
         myDecks = loadJSON('myDecks.json');
        }
        
        // INITIALIZE GUI
        function setup() {
          UI = new p5.slidesUI(myDecks,sketches);
        }

        // START PRESENTATION LOOP
        function draw() {
          UI.display();
          UI.checkInteraction();
        }

3. Use the GUI to start making slides!

 ### Optional: Direct Download
 [Library Only](https://raw.githubusercontent.com/GarrettMFlynn/p5.js-slides/gh-pages/lib/p5.slides.js)
 

 ## Images
 ![Showcase Example](/img/Showcase.png)
 ![Panel Example](/img/Panels.png)
 ![Custom Slide Example](img/Custom.png)
 
        
 ## Reference
 
 **P5.slides** contains two objects:
 1. **p5.slidesUI()**: The GUI and deck holder
 2. **p5.slideDeck()**: Individual decks
 
 ### p5.slidesUI
 #### Methods
 * **addSlides**: Add new slide to deck
 * **slideTemplates**: Determine which template to apply to current slide
 
 
 ### p5.slideDeck
 #### Methods
 * **display**: Display current slide on the GUI
 * **checkInteraction**: Check whether any interactions have occurred during the past loop
 * **createSidebars**: Create and populate GUI sidebars
 * **editMode**: Switch GUI to edit mode
 * **presentMode**: Switch GUI to present mode
 * **saveSlides**: Save all slide decks
 * **showDeckTabs**: Update existing deck tabs
 * **drawFromTouch**: Place text OR sketches based on mouse input
 * **textResizer**: Resize text to (sub)header or body text specifications
 * **toggleCanvases**: Remove and add canvases to the GUI
 * **toggleEditText**: Remove p5 text text and add HTML input boxes to the GUI
 * **togglePresentText**: Remove HTML input boxes and add p5 text to the GUI
 * **iframeRemapper**: Resize iframe objects in relation to current window
 * **textRemapper**: Resize current text objects in relation to current window
 * **allGlobalVariables**: Initialize global variables 
 * **JSONify**: Convert deck array into a JSON-able format
 * **unpackJSON**: Convert a saved JSON into the deck array for a new GUI session
 
 
 
