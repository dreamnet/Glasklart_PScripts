﻿// Script for automatic generating Glasklart .png icons (@2x, ~ipad@2x and @3x) using smart objects.
// This script only works with Photoshop CS6 and Photoshop CC!!
// The script needs the Glasklart Icon Templates (seed vars below) and a 1024x1024px source .png file.
// written by @dreamnet 03-16-15

// Please set the vars below to your needs! -----------------------------------------------------------------------
var templateFolder = 'D:/Users/Kirchi/Desktop/Glasklart PScripts'; // the folder containing the 'template' folder
var outputFolder = 'D/Users/Kirchi/Desktop'; // The output folder where the finished icons will be saved.
// end editable vars ----------------------------------------------------------------------------------------------

#target photoshop
// app.bringToFront();
// Show dialog for the 1024x1024px png source file
var sourceFile = File.openDialog ("Please select the 1024x1024px Glasklart PNG source file", "*.png", false)

// checking source file dimensions
var doc = open(sourceFile); // open SourceFile
var doc = app.activeDocument;
var sourceFileName = doc.name;
var width = doc.width.as('px');  
var height = doc.height.as('px');
if(width != 1024 || height != 1024) { // we have a problem
    var message = 'Source file has wrong dimensions. Please check.'+'\n'+'Width: '+width+'px, Height: '+height+'px';
    alert(message,'Wrong sourcefile...', 'errorIcon')
} else { // all ok, continue
    drawMarkers(); // drawing two 10% opaque rectangles into the source file to get rid of problems with centering it in the template files
    saveFile(outputFolder,sourceFileName);
    doc.close(SaveOptions.DONOTSAVECHANGES); // closing source file
    // set paths to template files
    var templateFile1 = File(templateFolder+'/templates/01_Glasklart_Icon_Template_@2x_Smart.psd');
    var templateFile2 = File(templateFolder+'/templates/02_Glasklart_Icon_Template_~iPad@2x_Smart.psd');
    var templateFile3 = File(templateFolder+'/templates/03_Glasklart_Icon_Template_@3x_Smart.psd');
    // generating the icons
    generateGlasklartIconSmart(templateFile1,sourceFile,outputFolder,"@2x.png"); // generates @2x Glasklart icon       | you can comment
    generateGlasklartIconSmart(templateFile2,sourceFile,outputFolder,"~iPad@2x.png"); // generates iPad Glasklart icon | out what you
    generateGlasklartIconSmart(templateFile3,sourceFile,outputFolder,"@3x.png"); // generates @3x Glasklart icon       | don't need
}
// end of script --------------------------------------------------------------------------------------------------

// functions ------------------------------------------------------------------------------------------------------
function drawMarkers() {
    var doc = app.activeDocument;
    var newLayer = doc.artLayers.add();
    var sqareColor = new RGBColor();
    sqareColor.red = 0; sqareColor.green = 0; sqareColor.blue = 0;
    selectedRegion = Array(Array(0,0),Array(0,1),Array(1,1),Array(1,0));
    doc.selection.select(selectedRegion);
    doc.selection.fill(sqareColor);
    selectedRegion = Array(Array(1023,1023),Array(1023,1024),Array(1024,1024),Array(1024,1023));
    doc.selection.select(selectedRegion);
    doc.selection.fill(sqareColor);
    doc.selection.deselect();
    newLayer.opacity = 10;
}
function generateGlasklartIconSmart(templateFile,sourceFile,outputFolder,fileName) {
    var templateDoc = open(templateFile); // open template
    template = app.activeDocument; // reference template
    app.activeDocument = template; // make sure template is in front
    var layer = template.activeLayer; // reference layer
    replaceSO(sourceFile);
    saveFile(outputFolder,fileName); // save file to given output folder
    templateDoc.close(SaveOptions.DONOTSAVECHANGES); // closing template
}
// function to replace content of a smart object
function replaceSO(sourceFile) {
    var id = stringIDToTypeID("placedLayerReplaceContents");
    var desc = new ActionDescriptor();
    var idn = charIDToTypeID("null");
    desc.putPath(idn,new File(sourceFile));
    var idp = charIDToTypeID("PgNm");
    desc.putInteger(idp,1);
    executeAction(id,desc,DialogModes.NO);
    return app.activeDocument.activeLayer;
}
// function for saving finished Glasklart icon to given ouput folder
function saveFile(outputFolder,fileName) {
    var opts;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;
    outputFile = new File('/'+outputFolder+'/'+fileName);
    app.activeDocument.exportDocument(outputFile,ExportType.SAVEFORWEB,opts);    
}
