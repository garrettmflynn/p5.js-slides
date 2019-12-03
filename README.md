
# [**p5.slides**](https://github.com/GarrettMFlynn/p5.js-slides)
**p5.slides** is a [p5.js](https://p5js.org/) application for the design of custom slide decks with dynamic content. You may find this useful for everything from class presentations to professional keynotes.

 ![Gif Example](img/Gif1.gif)
 **Created by** Garrett Flynn (gflynn@usc.edu) at the University of Southern California
 
  ### Known Bugs

 
 ## Getting Started
 
 ### Playtest
 [Alpha Release](https://garrettmflynn.github.io/p5.js-slides/app/)

 ### Full Functionality

 #### Download the Library from Github
 
 
 #### Edit your Slides
 1. Interact with Template Elements
 2. Draw your own objects
 3. Draw sketches
 4. Add decks, add slides
 5. Toggle transitions

 #### Save and Reload your Slides
 
 #### Present your Slides



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
 
 
 
