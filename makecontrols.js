// initialize global parameter values
var numFreqs, numLocs;
var matrixMeanArray, regions_seq = [], regions_file;

// update function for slider
var updateThreshSlide = function(thresh) {

    // adjust the text on the range slider
    // of note, it looksl ike thresh.value is a STRING, might need to be converted to a floating point for calculations 
    d3.select("#thresh-value").text(thresh);
    slideVal = parseFloat(thresh)
};

// overall update function
var update = function() {
    // Regrab controls values
    var freqrange = d3.select("#freqrange").property("value").split(" - ");
    
    var f1 = freqrange[0],
        f2 = freqrange[1],
        typeNum = d3.select("#opts").node().value,
        showSelf = d3.select('#showSelf').node().value;
                
    freqRange = math.range(f1,f2);
    var locsRange = math.range(0,numLocs);
    var indexR =  math.index(freqRange,locsRange,locsRange,math.range(0,1));
    var indexI =  math.index(freqRange,locsRange,locsRange,math.range(1,2));
    var matrixR = matrixData.subset(indexR);
    var matrixI = matrixData.subset(indexI);

    if (typeNum == "AbsVal")
        subsetMatrix = math.sqrt(math.add(math.square(matrixR),math.square(matrixI)));
    else if (typeNum = "Angle")
        subsetMatrix = math.add(math.atan2(matrixI, matrixR), 2*math.pi);

    matrixMeanArray = math.squeeze(math.mean(subsetMatrix,0)).valueOf();

    if(showSelf == "NOshowSelf"){
        for (i = 0; i < 64; i++){
            matrixMeanArray[i][i] = 0;
        }
    }
    renderChord(regions_global, matrixMeanArray);
};

// read in data, using initial guys
d3.json("dataFULL.txt", function(data) {

    //parse the JSON with the math.js reviver
    a = JSON.parse(data, math.json.reviver);

    // use math.js to make a matrix
    matrixData = math.matrix(a);
    sizeMatrix = matrixData.size();
    numFreqs = sizeMatrix[0];
    numLocs = sizeMatrix[1];

    // construct number sequence as labeling option
    for (var i = 0; i < numLocs; i++){
        regions_seq.push({
            color: "#ff0000",
            fullname: i,
            name: i
        });
    }
    
    // update button on click
    d3.select("#rerender")
        .on("click", update);

    // update slider on input to slider
    d3.select("#thresh")
        .on("input", function() {
            updateThreshSlide(+this.value);
            threshChords(+this.value);
        });
    
    d3.select("#labelmode")
        .on("input", function() {
            labelRegion(this.value);
        });
        
    // Dynamic slider generation
    $(function() {
        $( "#freqslider" ).slider({
        range: true, min: 0, max: numFreqs, step: 1, values: [ 0, numFreqs ],
        slide: function( event, ui ) {
            $( "#freqrange" ).val(ui.values[ 0 ] + " - " + ui.values[ 1 ] ); }
        });
        $( "#freqrange" ).val($( "#freqslider" ).slider( "values", 0 ) +
        " - " + $( "#freqslider" ).slider( "values", 1 ) );
    });

    // buttonFreq
    //         .on("click",function(){
    //             channel_1 = d3.select("#chan1").node().value;
    //             channel_2 = d3.select("#chan2").node().value;

    //             updateFreqsPlot();
    //         });

});