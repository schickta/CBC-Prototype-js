/*
External.js includes functions which will serve as an interface to the hosting application
*/

function GetSampleImages() {
    "use strict";
    
    var sampleElts = {};
    
    sampleElts.Count = 3;
    
    sampleElts.Samples = [
        {
            "Image": "3240932409-2014-01-01-34983-Donor 2-normal Hct-LED30.png",
            "Results": "3240932409-2014-01-01-34983-Donor 2-normal Hct-LED30.txt",
            "ID": "Donor 2-normal Hct",
            "Date": "01/01/2014"
        },
        {
            "Image": "123456789-2014-09-22-134853-Donor 1-normal Hct-LED15.png",
            "Results": "123456789-2014-09-22-134853-Donor 1-normal Hct-LED15.txt",
            "ID": "Donor 1-normal Hct-LED15",
            "Date": "09/22/2014"
        },
        
        {
            "Image": "123456789-2014-09-22-135139-Donor 1-normal Hct-LED30.png",
            "Results": "123456789-2014-09-22-135139-Donor 1-normal Hct-LED30.txt",
            "ID": "Donor 1-normal Hct-LED30",
            "Date": "09/22/2014"
        }
    ];
    
    return (sampleElts);
    //return (JSON.stringify (sampleElts));
}
