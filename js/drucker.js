/* ************************************************************
DRUCKER.JS : Contains the working code for the CBC prototype.
Note that any file which includes this js, must also include 
Markers.js first! 
*/

/* ************************************************************
GLOBAL VARIABLES: The current x and y position (top left corner)
of the main image. 
*/
var x = 0;
var y = 0;

/* ************************************************************
CONSTANTS : These represent constants, although they are actually
global variables (constants aren't standard in javascript).

Unfortunately, CSS doesn't support constants either, so the image 
manipulation functions are parameterized with the below "constants". Parameters for basic side-button and bottom-button layouts are herein. 

In general:

1024S represents a layout that has dimensions of 1024 x 600, with the 
buttons on the side (either side).

1024B represents a layout that has dimensions of 1024 x 600, with the 
buttons on the bottom.
*/

// Represent the height of the main image canvas for the basic 
// layouts and are used to determine which layout mode we're in.

var cbcCanvas1024BottomHeight = 625;
var cbcCanvas1024SideHeight = 970;

// Represent the extent of the main image (test tube) that will 
// be grabbed and positioned within the canvas. 

var cbcImageXCropx1024S = 200;
var cbcImageWidthCropx1024S = 1600;
var cbcImageHeightCropx1024S = 3000;

var cbcImageXCropx1024B = 200;
var cbcImageWidthCropx1024B = 1600;
var cbcImageHeightCropx1024B = 3000;

// Represent the dimensions of the canvas onto which the main image
// will be projected.

var cbcCanvasScaleWidthx1024S = 500;
var cbcCanvasScaleHeightx1024S = 250;

var cbcCanvasScaleWidthx1024B = 500;
var cbcCanvasScaleHeightx1024B = 250;

// Represent the extent of the preview image's thumb which outlines
// the area of the main image which is currently-visible.

var previewThumbShapeXx1024S = 4;
var previewThumbShapeWidthx1024S = 65;
var previewThumbShapeHeightx1024S = 100;

var previewThumbShapeXx1024B = 4;
var previewThumbShapeWidthx1024B = 50;
var previewThumbShapeHeightx1024B = 100;

// Represent the extent of the preview image's marker lines

var previewLineXx1024S = 10;
var previewLineWidthx1024S = 60;

var previewLineXx1024B = 6;
var previewLineWidthx1024B = 53;

// Represent the number of pixels of the main image that will be 
// scrolled in both fast and slow modes.

var scrollFastMovementx1024S = 500;
var scrollSlowMovementx1024S = 10;

var scrollFastMovementx1024B = 500;
var scrollSlowMovementx1024B = 10;

// This adjustment factor ensures that the markers on the main
// image remain aligned to their anchor position as the image 
// is scrolled 
var markerScrollAdjustmentFactorx1024S = 220;
var markerScrollAdjustmentFactorx1024B = 205;   // 21

// This adjustment factor ensures that the main image stays
// aligned with the finger during touch drag movements. 
var touchDistanceMultiplierx1024S = 1.8;
var touchDistanceMultiplierx1024B = 2.7;

// Fine tunes the preview rectangle placement upon a 
// touch action on the preview window.
var touchPreviewAdjustmentx1024S = 1800;
var touchPreviewAdjustmentx1024B = 800;

// Represent the min and maximum Y values for the CBC main and
// preview canvases. Preview Varies based on layout.

var CBCMaxY = -11800;
var CBCMinY = -109;   

var PreviewMinYx1024S = 180;
var PreviewMaxYx1024S = 940;
var PreviewMinYx1024B = 270;
var PreviewMaxYx1024B = 940;
  
/* ************************************************************
PARAMETERIZED FUNCTIONS: Return the values for image manipulation
based on the pre-defined constants for a layout.
*/

// Returns the number of pixels to scroll for fast-mode scrolling
// (up and down).
//
function scrollFast() {
    "use strict";
    
    var sfVal = scrollFastMovementx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.
    
    if (canvasHeight === cbcCanvas1024BottomHeight) {
        sfVal = scrollFastMovementx1024B;
    }

    return (sfVal);
}

// Returns the number of pixels to scroll for slow-mode scrolling
// (up and down).
//
function scrollSlow() {
    "use strict";
    
    var sfVal = scrollSlowMovementx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.
    
    if (canvasHeight === cbcCanvas1024BottomHeight) {
        sfVal = scrollSlowMovementx1024B;
    }

    return (sfVal);
}

// Returns an array with image source and target values to determine
// placement of the main cbc image on the canvas. Values are based 
// on the resolution we're running and the layout type.
//
function cbcImageParams() {
    
    "use strict";
    
    // Default return values.
    
    var XPos = cbcImageXCropx1024S;
    var YPos = Math.abs(y);
    var WidthCrop = cbcImageWidthCropx1024S;
    var HeightCrop = cbcImageHeightCropx1024S;
    var cvsX = 0;
    var cvsY = 0;
    var cvsWidth = cbcCanvasScaleWidthx1024S;
    var cvsHeight = cbcCanvasScaleHeightx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.
    
    if (canvasHeight === cbcCanvas1024BottomHeight) {
        XPos = cbcImageXCropx1024B;
        YPos = Math.abs(y);
        WidthCrop = cbcImageWidthCropx1024B;
        HeightCrop = cbcImageHeightCropx1024B;
        cvsX = 0;
        cvsY = 0;
        cvsWidth = cbcCanvasScaleWidthx1024B;
        cvsHeight = cbcCanvasScaleHeightx1024B;
    }
    
    // Return our array of values.
    
    return [XPos, YPos, WidthCrop, HeightCrop,
            cvsX, cvsY, cvsWidth, cvsHeight];
}

// Returns the extent of our preview thumb rectangle. 
//
function previewThumbParms() {
    "use strict";
    
    var previewThumbX = previewThumbShapeXx1024S;
    var previewThumbWidth = previewThumbShapeWidthx1024S;
    var previewThumbHeight = previewThumbShapeHeightx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {
        
        previewThumbX = previewThumbShapeXx1024B;
        previewThumbWidth = previewThumbShapeWidthx1024B;
        previewThumbHeight = previewThumbShapeHeightx1024B;     

    }

    return [previewThumbX, previewThumbWidth, previewThumbHeight];
}

// Return the line extent for a preview marker line.
//
function previewLineParms () {
    "use strict";
    
    var previewLineX = previewLineXx1024S;
    var previewLineWidth = previewLineWidthx1024S;

    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {
        
        previewLineX = previewLineXx1024B;
        previewLineWidth = previewLineWidthx1024B;    
    }
    
    return [previewLineX, previewLineWidth];
}

// Returns the new y (top) position of the preview thumb rectangle.
//
function previewThumbAdjustment() {
    "use strict";

    // Calculate the return y value using the main image y value and 
    // height and using that as a ratio factor with the preview image
    // height.
    
    var imgHt = image.height; 
    var imgY = Math.abs (y);
    var pvHt = parseInt ($('#previewImg').css("height"), 10);
    
    var thumbAdjust = (imgY * pvHt) / imgHt;

    return (thumbAdjust);
}

// Returns an adjustment factor for keeping the main image in
// synch with a touch-drag operation.
//
function touchDistanceMultiplier () {
    "use strict";
    
    var tdMultiplier = touchDistanceMultiplierx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {
        tdMultiplier = touchDistanceMultiplierx1024B;
    }
    
    return (tdMultiplier);
}

// Returns an adjustment factor for keeping main image marker lines
// in synch with the image being scrolled.
//
function markerScrollAdjustmentFactor (){
    "use strict";
    
    var mscrollAdjustment = markerScrollAdjustmentFactorx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {

        mscrollAdjustment = markerScrollAdjustmentFactorx1024B;
    }
    
    return (mscrollAdjustment);
    
} /* markerScrollAdjustmentFactor */
  
function touchPreviewAdjustment () {
    "use strict";
    
    var touchPreviewAdjust = touchPreviewAdjustmentx1024S;

    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {

        touchPreviewAdjust = touchPreviewAdjustmentx1024B;
    }
    
    return (touchPreviewAdjust);
    
} /* touchPreviewAdjustment */


// The min and max Y values for the preview image varies according to 
// the layout. Return the proper values.
///
function previewMinMax () {
    
    "use strict";
    
    var previewMinY = PreviewMinYx1024S;
    var previewMaxY = PreviewMaxYx1024S;
    
    // Determine the cbc canvas height as a means of deciding which
    // layout mode we're in.
    
    var canvasHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    
    // If our layout mode is different from the default x1024S,
    // return the appropriate parameters.

    if (canvasHeight === cbcCanvas1024BottomHeight) {
    
        previewMinY = PreviewMinYx1024B;
        previewMaxY = PreviewMaxYx1024B;
    }
    
    return [previewMinY, previewMaxY];
    
} /* previewMinMax */

/* ************************************************************
INITIALIZATION FUNCTIONS: Initialize our visual components, often based
on our parameter constants.
*/

// Sets up the extent of the preview thumb rectangle, based on the layout
// parameters.
//
function initializePreviewThumb() {
    "use strict";

    var previewParms = previewThumbParms ();
    
    $('#svgPreviewThumb').attr('y', "0");
    $('#svgPreviewThumb').attr('x', previewParms[0]);
    $('#svgPreviewThumb').attr('width', previewParms[1]);
    $('#svgPreviewThumb').attr('height', previewParms[2]);
}

// Initialize markers that are used for BOTH the main and preview images.
// This function will create Marker objects (see markers.js) and associate them
// with visual svg line elements overlaying the main and the preview images.
//
function initializeMarkers () { 
    "use strict";
    
    var markerIDs =   ["Top of Closure", 
                        "Bottom of Float", 
                        "Top of RBCs", 
                        "Top of Granulocytes", 
                        "Top of Lymph & Mono", 
                        "Top of Platelets",
                        "Top of Float",
                        "Meniscus"];

    // In case we're establishing a new image, remove any existing markers.
    
    clearMarkerStack ();
    
    // Retreive all line elements for both main and preview svg canvases. 
    // Ensure that there are the same number of elements in both (otherwise,
    // this would mean that the main image has a different max number of markers
    // than the preview, which wouldn't make sense.
    
    var allElements = svgCBCPanel.getElementsByTagName("line");
    var previewElements = svgPreviewThumbPanel.getElementsByTagName("line");
    
    if (allElements.length !== previewElements.length) {
        alert ("number of markers must be the same for main and preview canvas");
        return;
    }
    
    // Get the x and width values for the preview marker lines. 
    
    var lineParms = previewLineParms ();
    
    // Create a Marker object for each <main, preview> line element pair. Associate the 
    // line elements with the Marker object, and add the Marker object to a global 
    // array (stack) that is managed by marker.js via InitializeMarkerElement.
    
    for(var i = 0; i < allElements.length; i++) {
        
        InitializeMarkerElement (markerIDs[i], allElements[i], previewElements[i],
                        parseInt ($('#cbcCanvas').css("width"), 10));
        
        previewElements[i].setAttribute ("x1", lineParms[0]); 
        previewElements[i].setAttribute ("x2", lineParms[1]); 
    }
}

/* ************************************************************
MANIPULATIONS FUNCTIONS: These functions manipulate and display the images and 
markers on the layout page.
*/

// Set the new top position of the preview thumb rectangle.
//
function updatePreviewPosition() {
    "use strict";
   
    $('#svgPreviewThumb').attr('y', previewThumbAdjustment());   
}

// Draws the image to the main canvas using the parameters to clip and 
// project the image based on the screen resolution and layout type.
//
function updateCBCImage(context, image) {
    "use strict";
   
    // ** drawimage parameters **
    //  img	 Specifies the image, canvas, or video element to use	 
    //  sx	        Optional. The x coordinate where to start clipping
    //  sy	        Optional. The y coordinate where to start clipping
    //  swidth	    Optional. The width of the clipped image
    //  sheight     Optional. The height of the clipped image
    //  x	        The x coordinate where to place the image on the canvas
    //  y	        The y coordinate where to place the image on the canvas
    //  width	    Optional. The width of the image to use (stretch or reduce)
    //  height	    Optional. The height of the image to use (stretch or reduce)
    // **
    
    var imgParms = cbcImageParams ();

    context.drawImage (image, imgParms[0], imgParms[1], 
                       imgParms[2], imgParms[3],
                       imgParms[4], imgParms[5],
                       imgParms[6], imgParms[7]);
    
    updateMarkers ();
}

// Iterates through and hit-tests all markers. If the marker "should be" visible on 
// the main canvas, set its y position and make it visible, otherwise, make the 
// marker invisible since it's not in the visible region.

function updateMarkers () {
    "use strict";
    
    var i, mrk, adjustedY; 
    
    // Calculate y of the image relative to top and mid canvas.
    var cvsHeight = parseInt ($('#cbcCanvas').css("height"), 10);
    var TopCanvasToImageY = Math.abs(y);
    var MidCanvasToImageY = Math.abs(y) + (cvsHeight / 2);
    
    for (i = 0; i < MarkerCount(); i++) {

        mrk = GetMarker (i);
        
        // calculate the Y of the marker line within the confines of 
        // the canvas.
        
        var distMidCvs = mrk.Y - MidCanvasToImageY;
        
        var adjustFactor = distMidCvs / (cvsHeight / 2) * markerScrollAdjustmentFactor ();
        
        adjustedY = mrk.Y - TopCanvasToImageY - adjustFactor;
        
        // Hit test the Y of the line to see if it actually
        // falls within the confines of the canvas. If so,
        // make it visible.
        
        if (adjustedY >= 0 && adjustedY <= cvsHeight) {

            mrk.element.setAttribute ("y1", adjustedY);
            mrk.element.setAttribute ("y2", adjustedY);
            mrk.element.setAttribute ("visibility", "visible");
        }
        else {
            mrk.element.setAttribute ("visibility", "hidden");
        }
    }
}

// Adds a new mark by Pushing a Marker (markers.js) and setting the location
// of the main and preview marker line elements.
//
function addMark() {
    "use strict";
    
    if (MarkerCount () < MaxAvailableMarkers ()) {
        
        var cvsHeight = parseInt ($('#cbcCanvas').css("height"), 10);
        var TopCanvasToImageY = Math.abs(y);
        var MidCanvasToImageY = Math.abs(y) + (cvsHeight / 2) - 5;

        PushMarker (MidCanvasToImageY);
        updateMarkers ();

        // Update the preview canvas too.

        var thumbY = parseInt ($('#svgPreviewThumb').attr('y'), 10);
        var thumbH = parseInt ($('#svgPreviewThumb').attr('height'), 10);
        var markerPos = thumbY + (thumbH / 2);
        var mrk = GetTopMarker ();

        mrk.previewElement.setAttribute ("y1", markerPos);
        mrk.previewElement.setAttribute ("y2", markerPos);   
        mrk.previewElement.setAttribute ("visibility", "visible");
        
        // Since a new mark has been added, prompt the user to select
        // the next interface.
        
        updateMarkPrompt ();
    }
    
    else {
        
        navigateFromTo ('#LAYOUT', '#REPORT');
    }
}

// Removes the last-added marker. If there are no markers, no action occurs. 
// In the future, we may want to do a "Back Button" action if there are no
// markers.
//
function undoMark () {
    "use strict";   
            
    var mrk = GetTopMarker ();
    
    if (mrk != null) {
        mrk.element.setAttribute ("visibility", "hidden");
        mrk.previewElement.setAttribute ("visibility", "hidden");
        PopMarker ();
        updateMarkers ();
        updateMarkPrompt ();
    }
    
    else {
        navigateFromTo('#LAYOUT', '#STARTUP');  
    }
}

// This function manages the prompt text that is displayed at the bottom
// of the Sample Analysis screen. It prompts the user as to the next 
// interface to mark. If all interfaces are marked, it will prompt the user
// to click once more to display the report.
//
function updateMarkPrompt () {
    "use strict";

    var nextMark = PeekInitializedMarker (MarkerCount());
    
    if (nextMark != null) {
                
        document.getElementById("interfaceLabel").innerHTML  = 
            "Select: " + nextMark.ID;
    }
    
    else {
        document.getElementById("interfaceLabel").innerHTML  = 
            "Click again for Analysis Report"; 
    }
    
} /* updateMarkPrompt */

function imageSelected () {
    "use strict;"
    
    alert ("Here");
} /* imageSelected */

/* ************************************************************
NAVIGATION FUNCTIONS:
*/
//   Scrolling functions that are attached to the LAYOUT buttons. Used to
//   scroll the blood sample image up and down on the canvas.
//
function scrollUpFast(context, image) {
    "use strict";
    
    if (y < 0) {
        y = y + scrollFast();
        updateCBCImage(context, image);
        updatePreviewPosition();
    }
}

function scrollDownFast(context, image) {
    "use strict";

    y = y - scrollFast();
    updateCBCImage(context, image);
    updatePreviewPosition();
}

function scrollUpSlow(context, image) {
    "use strict";
    
    if (y < 0) {
        y = y + scrollSlow();
        updateCBCImage(context, image);
        updatePreviewPosition();
    }
}

function scrollDownSlow(context, image) {
    "use strict";
    
    y = y - scrollSlow();
    updateCBCImage(context, image);
    updatePreviewPosition();
}

function scrollTo (context, image, newY) {
    "use strict";
    
    var newYVal = parseInt (newY);
    
    if (newYVal >= -11800 && newYVal <= -109) {
        
        y = newYVal;
        updateCBCImage(context, image);
        updatePreviewPosition();
    }
}

// lastNavigatedPage is a stack which contains the breadcrumb of Page ID's which 
// which when followed end up back at the Start page. This is used to implement
// navigation history, particularly for Settings which may be called from 
// a number of other pages, and displays other sub-pages (answers the question: 
// where do you go when the Back button is pressed.
//
var lastNavigatedPage = []; 

// Navigate from one "page" to another. A page is actually a special div
// tag on the index.html page. JQuery is used to do some simple transitions.
//
function navigateFromTo(from, to) {
    "use strict";
    
    lastNavigatedPage.push (from);

    $(from).fadeOut(500);
    $(to).fadeIn(1000);
}

// Implements navigation for the Back button. Particularly for the Settings
// page which may be called from a variety of pages. 
//
function navigateBack (from) {
    "use strict";
    
    var nextPage = lastNavigatedPage.pop ();
    
    if (nextPage != null && nextPage != "") {
        $(from).fadeOut(500);
        $(nextPage).fadeIn(1000);
    }
}

// Set the layout css according to the Settings layout radio button selected.
// Then navigate to the layout screen.
//
function settingsBackButtonClicked() {
    "use strict";
    
    var layoutRadio = document.getElementsByName ("layout");

    if (layoutRadio[0].checked) {       // Layout 1 selected.
        document.getElementById('skinStylesheet').href="css/Skin1-1024.css"; 
    }
    
    else if (layoutRadio[1].checked) {  // Layout 2 selected.
        document.getElementById('skinStylesheet').href="css/Skin2-1024.css"; 
    }
    
    else if (layoutRadio[2].checked) {  // Layout 3 selected.
        document.getElementById('skinStylesheet').href="css/Skin3-1024.css"; 
    }
    
    navigateBack ('#LAYOUTSETTINGS');
    
} /* settingsBackButtonClicked */

