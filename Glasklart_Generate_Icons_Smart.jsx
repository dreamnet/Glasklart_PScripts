// Script for automatic generating Glasklart .png icons (@2x, ~ipad@2x and @3x) using smart objects.
// This script only works with Photoshop CS6 and Photoshop CC!!
// The script needs the Glasklart Icon Templates (seed vars below) and a 1024x1024px source .png file.
// written by @dreamnet 03-16-15

// Please set the vars below to your needs! -----------------------------------------------------------------------
var templateFolder = 'D:/Users/Kirchi/Desktop/Glasklart PScripts'; // the folder containing the 'template' folder
var outputFolder = 'D/Users/Kirchi/Desktop'; // The output folder where the finished icons will be saved.
// end editable vars ----------------------------------------------------------------------------------------------

#target photoshop
app.bringToFront();
// Show dialog for the 1024x1024px png source file
var sourceFile = File.openDialog ("Please select the 1024x1024px Glasklart PNG source file", "*.png", false)
// set paths to template files
var templateFile1 = File(templateFolder+'/templates/01_Glasklart_Icon_Template_@2x_Smart.psd');
var templateFile2 = File(templateFolder+'/templates/02_Glasklart_Icon_Template_~iPad@2x_Smart.psd');
var templateFile3 = File(templateFolder+'/templates/03_Glasklart_Icon_Template_@3x_Smart.psd');
// generating the icons
generateGlasklartIconSmart(templateFile1,sourceFile,outputFolder,"@2x"); // generates @2x Glasklart icon       | comment out
generateGlasklartIconSmart(templateFile2,sourceFile,outputFolder,"~iPad@2x"); // generates iPad Glasklart icon | what you
generateGlasklartIconSmart(templateFile3,sourceFile,outputFolder,"@3x"); // generates @3x Glasklart icon       | don't need
// end of script --------------------------------------------------------------------------------------------------

// functions ------------------------------------------------------------------------------------------------------
function generateGlasklartIconSmart(templateFile,sourceFile,outputFolder,fileName) {
    var templateDoc = open(templateFile); // open template
    template = app.activeDocument; // reference template
    app.activeDocument = template; // make sure template is in front
    var layer = template.activeLayer; // reference layer
    replaceSO(sourceFile);
    saveFile(outputFolder, fileName); // save file to above set output folder
    templateDoc.close(SaveOptions.DONOTSAVECHANGES); // closing template
}
// function to replace content of a smart object
function replaceSO(sourceFile) {
    var id = stringIDToTypeID( "placedLayerReplaceContents" );
    var desc = new ActionDescriptor();
    var idn = charIDToTypeID("null");
    desc.putPath( idn, new File(sourceFile));
    var idp = charIDToTypeID("PgNm");
    desc.putInteger(idp, 1);
    executeAction(id, desc, DialogModes.NO);
    return app.activeDocument.activeLayer;
}
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
