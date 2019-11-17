# p5.js-slides
Create a Slide Deck using p5.js

Garrett Flynn (gflynn@usc.edu)
University of Southern California

*P5.slides* is a GUI for the design of custom slide decks with dynamic content. You may find this useful for everything from class presentations to professional keynotes.


*P5.slides* contains two objects:
 1. *p5.slidesUI()*: The GUI and deck holder
 2. *p5.slideDeck()*: Individual decks
 
 ## Download
 [Library Only](https://raw.githubusercontent.com/GarrettMFlynn/p5.js-slides/gh-pages/lib/p5.slides.js)
 
 ## Examples
 
 ### Basic Sketch Format
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
        
        
 ## Reference
 
