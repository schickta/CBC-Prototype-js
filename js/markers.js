/* ************************************************************
MARKERS.JS : Implements a Marker class for the Drucker CBC 
prototype. Markers are line elements that are placed on a
blood sample image to mark interfaces between the various 
blood layers.
*/

// The Marker class:
//      Y : The Y position of the marker relative to the top of the image.
//      ID : A string that identifies the marker. 
//      element : The SVG line element for the marker on the main image.
//      previewElement : The SVG line element for the preview marker.
//
function Marker(Y, ID, element, previewElement) {
  this.Y = Y;
  this.ID = ID;
  this.element = element;
  this.previewElement = previewElement;
}

// Global Variables: 

var Markers = new Array ();  // An array of Markers. Acts as a stack for add/undo
var NextMarkerPos = 0;       // Represents the top of stack pointer.
var MaxMarkers = 0;          // The total number of available (initialized) markers.

// During application initialization, pushes new Marker objects onto the stack.
// Two SVG line elements are associated with the marker.
//
function InitializeMarkerElement (ID, element, previewElement, lineLen) {
    
    element.setAttribute ("x2", lineLen);
    
    Markers.push (new Marker (0, ID, element, previewElement));
    MaxMarkers = MaxMarkers + 1;
}

// Removes (clears) all markers from the array and resets the position
// variables.
//
function clearMarkerStack () {
    for (i = 0; i < MaxMarkers; i++ ) {
        Markers.pop ();
    }
    
    MaxMarkers = 0;
    NextMarkerPos = 0;
}

// Activates a marker at the top of the stack. Checks that the maximum number 
// of markers has not been reached.
//
function PushMarker (Y) {
    
    if (NextMarkerPos < MaxMarkers) {
        Markers[NextMarkerPos].Y = Y;
        NextMarkerPos = NextMarkerPos + 1;
    }
}

// Remove the topmost marker from the stack. Checks that the stack isn't
// empty.
//
function PopMarker () {
    
    if (NextMarkerPos > 0) {
        NextMarkerPos = NextMarkerPos - 1;
    }
}

// Return the topmost marker from the stack. Null, if there are no markers.
//
function GetTopMarker () {
    
    var myMarker = null;
    
    if (NextMarkerPos > 0) {
        myMarker = Markers[NextMarkerPos - 1];
    }
    
    return (myMarker);
}

// Returns the marker at the given [zero-based] index. Null if the index is
// out of range.
//
function GetMarker (mIndex) {
    
    var myMarker = null;
    
    if (mIndex >= 0 && mIndex < NextMarkerPos) {
        myMarker = Markers[mIndex];
    }
    
    return (myMarker);
}

// Returns an initialized marker in the given mIndex position. Note: this doesn't
// have to be an active marker.
//
function PeekInitializedMarker (mIndex) {
    
    var myMarker = null;
    
    if (mIndex >= 0 && mIndex < MaxMarkers) {
        myMarker = Markers[mIndex];
    }
    
    return (myMarker);
}

// Return the number of markers on the stack.
//
function MarkerCount () {
    return (NextMarkerPos);
}

// Returns the maximum number of available markers. 
// This differs from MarkerCount which returns the number
// of markers that have been placed onto the image.
//
function MaxAvailableMarkers () {
    return (MaxMarkers);
} /* MaxAvailableMarkers */

