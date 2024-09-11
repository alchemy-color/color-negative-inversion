// by Aaron Buchler, 2023
// https://github.com/abpy/color-neg-resources
// updated by Paulo Cunha Martins
// https://github.com/alchemy-color/negative-inversion

// add exposure
function addExposureLayer(e, o, g) {
    var idMk = charIDToTypeID( "Mk  " );
    var desc84 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref18 = new ActionReference();
    var idAdjL = charIDToTypeID( "AdjL" );
    ref18.putClass( idAdjL );
    desc84.putReference( idnull, ref18 );
    var idUsng = charIDToTypeID( "Usng" );
    var desc85 = new ActionDescriptor();
    var idType = charIDToTypeID( "Type" );
    var desc86 = new ActionDescriptor();
    var idpresetKind = stringIDToTypeID( "presetKind" );
    var idpresetKindType = stringIDToTypeID( "presetKindType" );
    var idpresetKindDefault = stringIDToTypeID( "presetKindDefault" );
    desc86.putEnumerated( idpresetKind, idpresetKindType, idpresetKindDefault );
    var idExps = charIDToTypeID( "Exps" );  
    desc86.putDouble( idExps, e );
    var idOfst = charIDToTypeID( "Ofst" );
    desc86.putDouble( idOfst, o );
    var idgammaCorrection = stringIDToTypeID( "gammaCorrection" );
    desc86.putDouble( idgammaCorrection, g );
    var idExps = charIDToTypeID( "Exps" );
    desc85.putObject( idType, idExps, desc86 );
    var idAdjL = charIDToTypeID( "AdjL" );
    desc84.putObject( idUsng, idAdjL, desc85 );
    executeAction( idMk, desc84, DialogModes.NO );

    // Return the newly created layer
    return app.activeDocument.activeLayer;
}

// set channel restrictions
function setChannelRestrictions(r, g, b) {
    var idsetd = charIDToTypeID( "setd" );
    var desc75 = new ActionDescriptor();
    var idnull = charIDToTypeID( "null" );
    var ref15 = new ActionReference();
    var idLyr = charIDToTypeID( "Lyr " );
    var idOrdn = charIDToTypeID( "Ordn" );
    var idTrgt = charIDToTypeID( "Trgt" );
    ref15.putEnumerated( idLyr, idOrdn, idTrgt );
    desc75.putReference( idnull, ref15 );
    var idT = charIDToTypeID( "T   " );
    var desc76 = new ActionDescriptor();
    var idchannelRestrictions = stringIDToTypeID( "channelRestrictions" );
    var list6 = new ActionList();

    if (r) {
        var idChnl = charIDToTypeID( "Chnl" );
        var idRd = charIDToTypeID( "Rd  " );
        list6.putEnumerated( idChnl, idRd );
    }

    if (g) {
        var idChnl = charIDToTypeID( "Chnl" );
        var idGrn = charIDToTypeID( "Grn " );
        list6.putEnumerated( idChnl, idGrn );
    }

    if (b) {
        var idChnl = charIDToTypeID( "Chnl" );
        var idBl = charIDToTypeID( "Bl  " );
        list6.putEnumerated( idChnl, idBl );
    }

    desc76.putList( idchannelRestrictions, list6 );
    var idLyr = charIDToTypeID( "Lyr " );
    desc75.putObject( idT, idLyr, desc76 );
    executeAction(idsetd, desc75, DialogModes.NO);
}

// delete layer mask if it exists
function deleteLayerMask(layer) {
    try {
        // Select the layer
        app.activeDocument.activeLayer = layer;

        // Delete the layer mask, if it exists
        var idDlt = charIDToTypeID( "Dlt " );
        var desc = new ActionDescriptor();
        var idnull = charIDToTypeID( "null" );
        var ref = new ActionReference();
        var idChnl = charIDToTypeID( "Chnl" );
        var idMsk = charIDToTypeID( "Msk " );
        ref.putEnumerated(idChnl, idChnl, idMsk);
        desc.putReference(idnull, ref);
        executeAction(idDlt, desc, DialogModes.NO);
    } catch (e) {
        // Layer mask does not exist, so nothing to delete
    }
}

// Create or get a group by name
function createOrGetGroupAboveSelectedLayer(groupName, selectedLayer) {
    var group;
    try {
        // Try to get the group if it exists
        group = app.activeDocument.layerSets.getByName(groupName);
    } catch (e) {
        // If the group doesn't exist, create it
        group = app.activeDocument.layerSets.add();
        group.name = groupName;
        // Move the group above the selected layer
        group.move(selectedLayer, ElementPlacement.PLACEBEFORE);
    }
    return group;
}

// Main processing
// foreground is darker gray patch, lower density (light) negative
var c1 = app.foregroundColor.rgb;
// background is lighter gray patch, higher density (dark) negative
var c2 = app.backgroundColor.rgb;

var r1 = c1.red / 255;
var g1 = c1.green / 255;
var b1 = c1.blue / 255;

var r2 = c2.red / 255;
var g2 = c2.green / 255;
var b2 = c2.blue / 255;

function log10(val) { return Math.log(val) / Math.LN10; }
function log2(val)  { return Math.log(val) / Math.LN2; }

r1 = log10(1 / r1);
g1 = log10(1 / g1);
b1 = log10(1 / b1);
r2 = log10(1 / r2);
g2 = log10(1 / g2);
b2 = log10(1 / b2);

var rs, gs, bs, rd, gd, bd, ra, ga, ba, rm, gm, bm;

rs = 1 / (r2 - r1);
gs = 1 / (g2 - g1);
bs = 1 / (b2 - b1);

// green channel is 1.0
var div = gs;
rs = rs / div;
gs = gs / div;
bs = bs / div;

rd = r1 * rs;
gd = g1 * gs;
bd = b1 * bs;

// green channel is 1.0
var md = gd;
ra = (md - rd) / rs;
ga = (md - gd) / gs;
ba = (md - bd) / bs;

rm = 1 / Math.pow(10, ra);
gm = 1 / Math.pow(10, ga);
bm = 1 / Math.pow(10, ba);
// Get the first layer in the document
var firstLayer = app.activeDocument.layers[0];

// Create or get the group and place it below the "Negative Reversal" group
var groupName = "Density Balance";
var group = createOrGetGroupBelowGroup(groupName, "Negative Reversal");

// Add the first exposure layer, rename it, move it to the group, and delete its mask
var redLayer = addExposureLayer(log2(rm), 0.0, 1 / rs);
setChannelRestrictions(true, false, false);
redLayer.name = "Density Balance Red";  // Renaming the layer
redLayer.move(group, ElementPlacement.INSIDE);
deleteLayerMask(redLayer);

// Add the second exposure layer, rename it, move it to the group, and delete its mask
var blueLayer = addExposureLayer(log2(bm), 0.0, 1 / bs);
setChannelRestrictions(false, false, true);
blueLayer.name = "Density Balance Blue";  // Renaming the layer
blueLayer.move(group, ElementPlacement.INSIDE);
deleteLayerMask(blueLayer);

// Deselect the group to collapse it
collapseGroupByDeselecting();

// Function to create or get a group and place it below the specified group
function createOrGetGroupBelowGroup(groupName, referenceGroupName) {
    var doc = app.activeDocument;
    var referenceGroup = null;
    var group = null;

    // Check if the reference group exists
    try {
        referenceGroup = doc.layerSets.getByName(referenceGroupName);
    } catch (e) {
        alert("Reference group '" + referenceGroupName + "' not found.");
        return null;
    }

    // Check if the target group already exists
    try {
        group = doc.layerSets.getByName(groupName);
        // If group exists, delete it
        if (group) {
            group.remove();
            group = null; // Reset group to create a new one
        }
    } catch (e) {
        // Group doesn't exist, so do nothing here
    }

    // Create a new group
    group = doc.layerSets.add();
    group.name = groupName;

    // Move the group below the reference group
    group.move(referenceGroup, ElementPlacement.PLACEAFTER);
    return group;
}

// Function to deselect the group to collapse it
function collapseGroupByDeselecting() {
    // Select the first layer to deselect the group
    app.activeDocument.activeLayer = app.activeDocument.layers[0];
}