// Script for automatic generating Glasklart .png icons (@2x, ~ipad@2x and @3x).

// The script needs the Glasklart Icon Templates (seed vars below) and a 1024x1024px source .png file.
//
// written by @dreamnet 12-30-14 - updated on 02-22-15

#target photoshop
app.bringToFront();

// Please set the vars below to your needs! -----------------------------------------------------------------------
var templateFolder = 'D:/Users/Kirchi/Desktop/Glasklart PScripts'; // the folder containing the 'template' folder
var outputFolder = 'D/Users/Kirchi/Desktop'; // The output folder where the finished icons will be saved.
// end editable vars ----------------------------------------------------------------------------------------------

// no changes should be done below this line unless You know what you are doing! ----------------------------------

// Show dialog for the 1024x1024px png source file
var sourceFile = File.openDialog ("Please select the 1024x1024px Glasklart PNG source file", "*.png", false)

// set paths to template files
var templateFile1 = File(templateFolder+'/templates/01_Glasklart_Icon_Template_@2x.psd');
var templateFile2 = File(templateFolder+'/templates/02_Glasklart_Icon_Template_~iPad@2x.psd');
var templateFile3 = File(templateFolder+'/templates/03_Glasklart_Icon_Template_@3x.psd');

generateGlasklartIcon(78,21,sourceFile,templateFile1,outputFolder,"@2x"); // generates 120px Glasklart icon (@2x)            | comment out
generateGlasklartIcon(100,26,sourceFile,templateFile2,outputFolder,"~iPad@2x"); // generates 152px Glasklart icon (~ipad@2x) | what you
generateGlasklartIcon(120,30,sourceFile,templateFile3,outputFolder,"@3x"); // generates 180px Glasklart icon (@3x)           | don't need

// functions ------------------------------------------------------------------------------------------------------
function generateGlasklartIcon(size,offSet,sourceFile,templateFile,outputFolder,fileName) {
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
        alert ("The layer has no effects! Check template file!");
        app.activeDocument.activeLayer = layer2;
    }
};

// function for saving finished Glasklart icon to given ouput folder
function saveFile(outputFolder, fileName) {
    var opts;
    opts = new ExportOptionsSaveForWeb();
    opts.format = SaveDocumentType.PNG;
    opts.PNG8 = false;
    opts.quality = 100;
    outputFile = new File('/'+outputFolder+'/'+fileName+'.png');
    app.activeDocument.exportDocument(outputFile, ExportType.SAVEFORWEB, opts);    
}
// end of script --------------------------------------------------------------------------------------------------