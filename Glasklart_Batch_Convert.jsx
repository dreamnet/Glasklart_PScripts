// Photoshop script for converting 1024x1024px Glasklart source files into Glasklart icons.
// The Script awaits existing input and output folders and the Glasklart icon templates (seed vars below).
//
// Folder structure:
//
// Glasklart PScripts
//      -> input (only 1024x1024px png files are accepted)
//      -> output
//          -> @2x
//          -> @3x
//          -> iPad@2x
//      -> templates
//          -> 01_Glasklart_Icon_Template_@2x.psd
//          -> 02_Galsklart_Icon_Template_~iPad@2x.psd
//          -> 03_Glasklart_Icon_Template_@3x.psd
//
// take care that this script deletes the input files after converting them to Glasklart icons without any prompting !!!
// if you don't want his, simply comment out line #51 (// sourceFile.remove();) <----------------------------------- !!!
//
// written by @dreamnet 12-22-14 - last overworked on 02-22-15

#target photoshop
// app.bringToFront();

// the base folder, normally you only need to change this to wherever your source files are (without ending slash!)
var baseFolder = 'D:/Users/Kirchi/Desktop/Glasklart PScripts'; 

var inputFolder = Folder(baseFolder+'/input'); // the folder witch contains the 1024x1024px source files
var outputFolder = Folder(baseFolder+'/output'); // the folder where the finished Glasklart icons are stored

// paths to template files
var templateFile1 = File(baseFolder+'/templates/01_Glasklart_Icon_Template_@2x.psd');
var templateFile2 = File(baseFolder+'/templates/02_Glasklart_Icon_Template_~iPad@2x.psd');
var templateFile3 = File(baseFolder+'/templates/03_Glasklart_Icon_Template_@3x.psd');

var fileList = inputFolder.getFiles('*.png'); // getting all .png's in input folder

for(var i=0; i<fileList.length; i++) { // loop trough input files
    
    var sourceFile = File(fileList[i]); // set path to source file
    var doc = open(sourceFile); // open SourceFile
    var doc = app.activeDocument;
    var docName = doc.name;
    docName = docName.replace(/(?:\.[^.]*$|$)/, '');
    drawMarkers();
    saveFile(inputFolder,docName);
    doc.close(SaveOptions.DONOTSAVECHANGES); // closing source file

    // get sourceDoc name (and remove file extension)
    // var docName = sourceFile.name;
    // docName = docName.replace(/(?:\.[^.]*$|$)/, '');

    generateGlasklartIcon(78, 21,  sourceFile, templateFile1, outputFolder+"/@2x", docName+"@2x");           // generates 120px Glasklart icon (@2x)      | comment out
    generateGlasklartIcon(100, 26, sourceFile, templateFile2, outputFolder+"/@2x~ipad", docName+"@2x~ipad"); // generates 152px Glasklart icon (@2x~ipad) | what you
    generateGlasklartIcon(120, 30, sourceFile, templateFile3, outputFolder+"/@3x", docName+"@3x");           // generates 180px Glasklart icon (@3x)      | don't need
    
    sourceFile.remove(); // delete source file from disk

}

// no changes should be done below this line ----------------------------------------------------------------------

// functions ------------------------------------------------------------------------------------------------------

function drawMarkers() { // function draws two 10% opaque rectangles into source to get rid of problems centering it in template
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

function generateGlasklartIcon(size,offSet,sourceFile,templateFile,outputFolder,fileName) { // function for generating a Glasklart icon
    var templateDoc = open(templateFile); // open template
    template = app.activeDocument; // reference template
    if(sourceFile != null) { var sourceDoc = open(sourceFile); } // open source file
    source = app.activeDocument; // reference source
    source.resizeImage(size,size,null,ResampleMethod.BICUBIC); // resize source file to given size
    source.selection.selectAll(); // select whole source document
    source.artLayers[0].duplicate(template, ElementPlacement.PLACEATBEGINNING); // duplicate layer to template
    source.close(SaveOptions.DONOTSAVECHANGES); // closing source file, not needed anymore
    app.activeDocument = template; // switch to template file
    var layer = template.activeLayer; // reference layer
    template.selection.select([[0,0],[0,size],[size,size],[size,0]]); // selecting the whole layer
    template.selection.translate(offSet,offSet); // moving selection (cant move layer, bacause Photoshop don't sees transparent pixels)
    template.selection.deselect(); // remove selection
    layerGroup = template.layerSets.getByName("Sample Icons");
    layerCopy = layerGroup.layers.getByName("com.atebits.Tweetie2");
    transferEffects(layerCopy, layer); // copy Glasklart style from sample icon to inserted layer
    saveFile(outputFolder, fileName); // save file to above set output folder
    templateDoc.close(SaveOptions.DONOTSAVECHANGES); // closing template
}

function saveFile(pathPart, fileName) { // function for save finished Glasklart icon (save for web)
    var opts;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;
    outputFile = new File(pathPart+'/'+fileName+'.png');
    app.activeDocument.exportDocument(outputFile, ExportType.SAVEFORWEB, opts);
}

function transferEffects (layer1, layer2) { // function to copy layer effects of one layer and apply them to another one
    app.activeDocument.activeLayer = layer1;
    try {
        var id157 = charIDToTypeID( "CpFX" );
        executeAction( id157, undefined, DialogModes.ALL );
        app.activeDocument.activeLayer.visible = !app.activeDocument.activeLayer.visible;
        app.activeDocument.activeLayer = layer2;
        var id158 = charIDToTypeID( "PaFX" );
        executeAction( id158, undefined, DialogModes.ALL );
    } catch (e) {
        alert ("the layer has no effects");
        app.activeDocument.activeLayer = layer2;
    }
};

// end of script --------------------------------------------------------------------------------------------------
