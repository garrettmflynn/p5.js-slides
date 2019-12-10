
# [**p5.slides**](https://github.com/GarrettMFlynn/p5.js-slides)
Interactive Presentations for the Web

Garrett Flynn (gflynn@usc.edu)  
IML 288: Critical Thinking and Procedural Media  
University of Southern California  

**p5.slides** is a [p5.js](https://p5js.org/) application for the design of custom slide decks with dynamic content. You may find this useful for everything from class presentations to professional keynotes. Press [here](https://garrettmflynn.github.io/p5.js-slides/app/) to try it out!

 ## Getting Started
  [![Youtube Video](p5_slides.png)](https://youtu.be/AZN1mE8sXXU)   
  **Video Introduction:** 10 Most Common Actions, Skills Learned, Lessons Learned, and A Call to Contribute  
    
 Try out the [Alpha Release](https://garrettmflynn.github.io/p5.js-slides/app/)
 
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

 ## Reference
 
 **P5.slides** contains three objects:
 1. **p5.slidesUI()**: The GUI and deck holder
 2. **p5.slideDeck()**: Individual decks
 3. **p5.PresentationAssets()**: Holder for P5 parameters (text/shapes)
 
 ### p5.slidesUI
 #### Methods
 ##### Global Variables
 * **allGlobalVariables**: Initialize global variables 
 
 ##### Main Looping Functions
 * **display**: Display current slide on the GUI
 * **checkInteraction**: Check whether any interactions have occurred during the past loop
 
 ##### Populate the UI with Buttons
 * **createSidebars**: Create and populate GUI sidebars
 * **showDeckTabs**: Update existing deck tabs
 
 ##### Display Modes
 * **editMode**: Switch GUI to edit mode
 * **presentMode**: Switch GUI to present mode
 
 ##### Change the Elements on the Screen
 * **textResizer**: Resize text to (sub)header or body text specifications
 * **toggleCanvases**: Remove and add canvases to the GUI
 * **toggleEditText**: Remove p5 text text and add HTML input boxes to the GUI
 * **togglePresentationAssets**: Convert HTML to P5 (for use in animations/transitions)
 * **togglePresentText**: Remove HTML input boxes and add p5 text to the GUI
 * **drawFromTouch**: Place text OR sketches based on mouse input
 
 ##### Remap Current Elements after Window Size Changes
 * **iframeRemapper**: Resize iframe objects in relation to current window
 * **textRemapper**: Resize current text objects in relation to current window
 
 ##### Save Slides
 * **saveSlides**: Save all slide decks
 * **JSONify**: Convert deck array into a JSON-able format
 * **unpackJSON**: Convert a saved JSON into the deck array for a new GUI session
 
  ### p5.slideDeck
 #### Methods
 * **addSlides**: Add new slide to deck
 * **slideTemplates**: Determine which template to apply to current slide
 
 ### p5.PresentationAssets
 #### Methods
 ##### Global Variables
 * **display**: Display presentation assets in the specified format
   * Current formats include shapes and text (which can further be converted into particles)
 * **particleDraw**: Calculate particle animations
