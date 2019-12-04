
# [**p5.slides**](https://github.com/GarrettMFlynn/p5.js-slides)
**p5.slides** is a [p5.js](https://p5js.org/) application for the design of custom slide decks with dynamic content. You may find this useful for everything from class presentations to professional keynotes.

 ![Gif Example](img/Gif1.gif)
 
 **Created by** Garrett Flynn (gflynn@usc.edu) at the University of Southern California
 
  ### Known Bugs
#### Saving
1. Does not maintain shapes or transitions
2. Does not allow for presenting

#### Editing
1. Content (i.e. text boxes, sketches, shapes, etc) cannot be removed once added
2. Content (i.e. text boxes, sketches, shapes, etc) cannot be translated once added
3. No way to change color palette

#### Presenting
1. Severe performance issues when adding many sketches to a slide deck
 
 ## Getting Started
 
 ### Playtest
 [Alpha Release](https://garrettmflynn.github.io/p5.js-slides/app/)

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
 
 
 
