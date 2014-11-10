function loadTouchSupport () {
    
    loadDocumentListeners ();
    loadMainImageListeners ();
    loadPreviewListeners ();
    
} /* loadTouchSupport */

function loadPreviewListeners (){  
        
    // SVG panel to which the listeners will attach.
    var loaderPreview = document.getElementById('svgPreviewThumbPanel');
    
    // div which will display status messages. Typically hidden
    // - for debugging purposes.
    var loaderStatus = document.getElementById('statusdiv');

    /*
        Preview Panel.touchstart : Begins a touch movement. The preview
        panel will only support click or drag movements. Set our start 
        variables.
    */
    loaderPreview.addEventListener('touchend', function(e){

        // Obtain our touch event information.
        touchobj = e.changedTouches[0];
        
        // Obtain the previewMinY and MaxY values (as an array).
        var pMinMax = previewMinMax ();
        var PreviewMinY = pMinMax[0];
        var PreviewMaxY = pMinMax[1];
        
        // for drag, we only care about movement along Y. Adjust starty
        // relative to the top of the preview pane.
        starty = parseInt(touchobj.clientY) - PreviewMinY ;
        
        // Calculate our CBCHeight and PreviewHeight which will be used
        // to transform the y position of the preview pane to the y
        // position of the CBC image.
        var CBCHeight = Math.abs (CBCMaxY) - Math.abs (CBCMinY);
        
        var PreviewHeight = Math.abs (PreviewMaxY) - Math.abs(PreviewMinY);
        
        // Calculate the new Y position for the CBC image. It was positive
        // because of the prior abs functions, but now make it negative
        // again (all Y positions of the CBC image are negative).
        var newY = - ( (starty * CBCHeight / PreviewHeight) + CBCMinY);

        // Adjust the preview rectangle to a nice position
        newY = newY - ((starty / (PreviewMaxY - PreviewMinY)) *
                       touchPreviewAdjustment ());
        
        // Using the MutationObserver animation technique, update our
        // y position for the CBC image. easeOutCubic
        $('#layoutImage').animate({top:newY}, 1000, "easeInOutQuint");  
        
        // output the current status to the debug div (which is typically
        // hidden.
        loaderStatus.innerHTML = 'touchend PreviewY: ' + starty + 'px';
        
        // prevent any downstream touch activities.
        e.preventDefault();
        
    }, false);

    
} /* loadPreviewListeners */

function loadDocumentListeners () {
    
    /* *********************************************************
        Layout Screen touch listener.
    */
    /*  This listener is attached to the body and prevents any
        unwanted touch actions.
    */
    document.body.addEventListener('touchmove', function(event) {
        event.preventDefault();
    }, false);   
}

function loadMainImageListeners () {
    
    // Set up constants for touch.
    var SwipeDirectionNone = 0;
    var SwipeDirectionUp = 1;
    var SwipeDirectionDown = -1;
    
    // Thresholds and constraints for swipe recognition.
    var threshold = 150;    // min distance traveled to be considered swipe
    var restraint = 50;     // max distance allowed at the same time in 
                            // perpendicular direction
    var allowedTime = 300;  // maximum time allowed to travel that distance
    
    /* *********************************************************
        Main image touch listeners: Add touch listeners to the 
        main image canvas (actually the svg overlay. These 
        listeners will handle scrolling based off of touch 
        gestures. 
    */
    
    // SVG panel to which the listeners will attach.
    var loaderCvs = document.getElementById('svgCBCPanel');
    
    // div which will display status messages. Typically hidden
    // - for debugging purposes.
    var loaderStatus = document.getElementById('statusdiv');
    
    // Used to locate the start of a drag or swipe. starty is used
    // for drag, pageStarts are for swipe. startTime is used to
    // determine the speed in which a movement has taken place in
    // order to decide if a swipe had occurred.
    var starty = 0;
    var pageStartX;
    var pageStartY;
    var startTime;
    
    // The calculate distance (x,y) for a touch movement. 
    var distX = 0;
    var distY = 0;
    
    // The new scroll position of the image after a swipe.
    var newY;
    
    // The touch information passed into the handlers. It is an 
    // array whereby each element represents a finger, in case of
    // multi-touch implementations. We're just concerned with [0]
    var touchObj = null;
    
    /*
        CBC Panel.touchstart : Begins a touch movement. In this case it
        could be a drag or swipe. Set our start variables for both
        possibilities.
    */
    loaderCvs.addEventListener('touchstart', function(e){

        // Obtain our touch event information.
        touchobj = e.changedTouches[0];
        
        // for drag, we only care about movement along Y.
        starty = parseInt(touchobj.clientY);

        // Initialize our start parameters for a potential swipe action.
        swipedir = 0;
        pageStartX = touchobj.pageX;
        pageStartY = touchobj.pageY;
        startTime = new Date().getTime();

        // output the current status to the debug div (which is typically
        // hidden.
        loaderStatus.innerHTML = 'touchstart ClientY: ' + starty + 'px';
        
        // prevent any downstream touch activities.
        e.preventDefault();
        
    }, false);

    /*
        CBC Panel.touchmove : Tracks the current touch movement. This event
        is for a drag movement only. Swipes are determined only at touchend.
    */
    loaderCvs.addEventListener('touchmove', function(e){

        // Obtain our touch event information.
        touchobj = e.changedTouches[0];
        
        // Determine the distance traveled, and reset starty to prepare
        // for the next event. Doing so also enables swipes to work
        // in conjunction with drags.
        distY = parseInt(touchobj.clientY) - starty
        starty = parseInt(touchobj.clientY);

        // Update our main y scroll value with the distance we've
        // traveled. touchDistanceMultiplier is configurable, and keeps 
        // the image exactly in line with the finger.
        y = y + distY * touchDistanceMultiplier ();

        // Upd // get time elapsedate the main image and preview positions.
        updateCBCImage(context, image);
        updatePreviewPosition();        

        // output the current status to the debug div (which is typically
        // hidden.
        loaderStatus.innerHTML = 'touchmove dist: ' +  distY + 'px';
         
        // prevent any downstream touch activities.
        e.preventDefault();

     }, false);

    /*
        CBC Panel.touchend : Determines if the movement is a swipe, and if 
        so, the direction. Performs the swipe animation to move to top
        or bottom of the image.
    */
    loaderCvs.addEventListener('touchend', function(e){

        // Obtain our touch event information.
        var touchobj = e.changedTouches[0];

        // Calculated the distance traveled (x,y) and elapsed time.
        var distX = touchobj.pageX - pageStartX;
        var distY = touchobj.pageY - pageStartY; 
        var elapsedTime = new Date().getTime() - startTime;
        
        // initialize our swipe direction variable. 
        var swipedir = SwipeDirectionNone;

        // Determine if the touch movement a) happened within an allowable 
        // time for a swipe, and b) was within a minimum x movement threshold, 
        // since we're looking for a vertical swipe and want to eliminate
        // false positives.
        if (elapsedTime <= allowedTime){       // Elapsed time for swipe is met
            
           if (Math.abs(distY) >= threshold &&   // x variation for swipe met
               Math.abs(distX) <= restraint)
           { 
               // Determine the y swipe direction, and appropriately set our 
               // new Y value to the top/bottom end of the image. 
                swipedir = (distY < 0) ? SwipeDirectionUp : SwipeDirectionDown; 
                
                newY = (swipedir == SwipeDirectionDown) ? CBCMinY : CBCMaxY;
               
                // This is where we actually scroll the image with a nice
                // animation and easing. This is done by animating on the "top"
                // style property of the layoutImage element placed on our LAYOUT
                // page. That property is observed using the MutationObserver
                // pattern, which actually does the scrolling of the image.
                $("#layoutImage").animate({top:newY}, 1000, "easeOutCubic");            
           }
        }
    
        // output the current status to the debug div (which is typically
        // hidden.
        if (swipedir == SwipeDirectionNone) {
            loaderStatus.innerHTML = 'touchend: newY = ' + y;
        }
        else {
            loaderStatus.innerHTML = 'touchend: ' + swipedir + 
                ((swipedir == SwipeDirectionUp) ? "Up Swipe" : "Down Swipe") + 
                ', newY = ' + y;
        }

        // prevent any downstream touch activities.
        e.preventDefault();

    }, false);
    
    
    /* *********************************************************
        MutationObserver : Set up a MutationObserver which watches
        for changes to the "top" style attribute of the hidden
        #layoutImage element placed on the #LAYOUT screen. When top
        is changed, the main image's y scroll position is changed. 
        This mechanism enables us to animage swipe touch movements
        on the main image. 
        
        NOTE: MutationObserver is a new pattern implemented in 
        newer versions of browsers.
    */
    
    // Find a MutationObserver object for the host brower.
    var MutationObserver = window.MutationObserver ||
        window.WebKitMutationObserver ||
        window.MozMutationObserver;

    // Create an observer function and a handler which is 
    // called when "top" changes.
    var observer = new MutationObserver(function(mutations) {

        // Obtain the first (probably only) mutation that
        // was observed.
        var mutation = mutations[0];
        
        // Parse the new "top" style attribute which is initially
        // of the form "top: 100px". Morph it to "100".
        var newYStr = mutation.target.style.cssText.slice (5);
        var newY = parseInt (newYStr, 10);

        // Set the new scroll y position and update the 
        // canvas/preview
        scrollTo (context, image, newY);     
    });  

    // Obtain the #layoutImage element from the DOM and 
    // begin observing it.
    layoutElt = document.getElementById ('layoutImage');

    observer.observe(layoutElt, {
        attributes: true, 
        attributeFilter: ["style"]
    });
    
} /* loadMainImageListeners */
