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
// if you don't want his, simply comment out line #82 (// sourceFile.remove();) <----------------------------------- !!!
//
// written by @dreamnet 12-22-14

#target photoshop // opening Photoshop
app.bringToFront(); // bring Photoshop to front

// the base folder, normally you only need to change this to wherever your source files are (without ending slash!)
var baseFolder = 'D:/Users/Kirchi/Desktop/Glasklart PScripts'; 

// no changes should be done below this line unless You know what you are doing! ----------------------------------

var inputFolder = Folder(baseFolder+'/input'); // the folder witch contains the 120x120px source files
var outputFolder = Folder(baseFolder+'/output'); // the folder where the finished Glasklart icons are stored

// paths to template files
var templateFile1 = File(baseFolder+'/templates/01_Glasklart_Icon_Template_@2x.psd');
var templateFile2 = File(baseFolder+'/templates/02_Glasklart_Icon_Template_~iPad@2x.psd');
var templateFile3 = File(baseFolder+'/templates/03_Glasklart_Icon_Template_@3x.psd');

var templateDoc = open(templateFile1);

var fileList = inputFolder.getFiles('*.png'); // getting all .png's in input folder

for(var i=0; i<fileList.length; i++) { // loop trough input files
    
    // set path to source file end open it
    var sourceFile = File(fileList[i]);
    var sourceDoc = open(sourceFile);

    // get sourceDoc name (and remove file extension)
    var docName = sourceDoc.name;
    docName = docName.replace(/(?:\.[^.]*$|$)/, '');

    // rename layer; duplicate to new document
    var layer = sourceDoc.activeLayer;
    layer.name = docName;
    activeDocument.selection.selectAll();
    sourceDoc.artLayers[0].duplicate(templateDoc, ElementPlacement.PLACEATBEGINNING);

    sourceDoc.close(SaveOptions.DONOTSAVECHANGES); // close sourceDoc

    var layer = templateDoc.activeLayer;

    // make a 120x120px selection and move it to center (can't translate layer because of the transparent pixels)
    activeDocument.selection.select([[0,0],[0,120],[120,120],[120,0]]);
    activeDocument.selection.translate(30,30);
    activeDocument.selection.deselect();

    layerGroup = activeDocument.layerSets.getByName("Sample Icons");
    layerCopy = layerGroup.layers.getByName("com.atebits.Tweetie2");
    transferEffects(layerCopy, layer); // copy Glasklart style from sample icon to inserted layer

    // save the file
    saveFile(pathPart, fileName);
    
    sourceFile.remove(); // delete source file from disk

}

templateDoc.close(SaveOptions.DONOTSAVECHANGES); // all finished, close template doc

// functions ------------------------------------------------------------------------------------------------------

// function for save finished Glasklart icon (save for web)
function saveFile(pathPart, fileName) {
    var opts;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;
    outputFile = new File(outputFolder+'/'+pathPart+'/'+fileName+'.png');
    app.activeDocument.exportDocument(outputFile, ExportType.SAVEFORWEB, opts);
}

// function to copy layer effects of one layer and apply them to another one
function transferEffects (layer1, layer2) {
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