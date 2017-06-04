var imagedir;
var rectarray = [];
var resultEditedImage = [];
var container;
var layerName;
var currSelectedColor = "grey";
var d3 = d3 || null; // compliance & can verify if loaded
var layers = ["objects", "pedestrian", "car", "signs", "traffic-lights"];

// set DIV backgraund to currSelectedColor
var colorBrushUI = document.getElementById('activeColor');
// colorBrushUI.style.backgroundColor = currSelectedColor;


window.addEventListener('DOMContentLoaded', function () {
    $.ajax({
        url: "/patterns/getrectarray",
        type: "get",
        dataType: 'json',
        success: function(response) {
            rectarray = JSON.parse(response.pattern_img);
            console.log("received array: " + JSON.stringify(rectarray));

            $.ajax({
                url: "/patterns/getfilename",
                type: "get",
                success: function(response) {
                    imagedir = '/'+response.file;
                    console.log("image dir passed to me: " + imagedir);
                    console.log("imagedata: " + JSON.stringify(rectarray.imagedata));

                    var numRows = rectarray.imagedata.numRows || -99;
                    var numCols = rectarray.imagedata.numCols || -99;

                    var rectWidth = rectarray.imagedata.naturalWidth / numCols || -99;
                    var rectHeight = rectarray.imagedata.naturalHeight / numRows || -99;

                    console.log("rectwidth: " + rectWidth);
                    console.log("rectheight: " + rectHeight);

                //   var margin = {top: -5, right: -5, bottom: -5, left: -5},
                //      owidth = 1920 - margin.left - margin.right,
                //      oheight = 1080 - margin.top - margin.bottom;
                
                    var margin = {top: -5, right: -5, bottom: -5, left: -5},
                        width = rectarray.imagedata.naturalWidth + rectWidth - margin.left - margin.right,
                        height = rectarray.imagedata.naturalHeight + rectHeight - margin.top - margin.bottom,
                        owidth = 1920 - margin.left - margin.right,
                        oheight = 1080 - margin.top - margin.bottom;

                    var zoom = d3.behavior.zoom().scaleExtent([0.4, 10]).on("zoom", zoomed);

                    var drag = d3.behavior.drag()
                            .origin(function (d) {
                                return d;
                            })
                            .on("dragstart", dragstarted)
                            .on("drag", dragged)
                            .on("dragend", dragended);

                    var svg = d3.select("#pattern").append("svg")
                            .attr("width", owidth + margin.left + margin.right)
                            .attr("height", oheight + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.right + ")")
                            .call(zoom);

                    var rect = svg.append("rect")
                            .attr("width", width)
                            .attr("height", height)
                            .style("fill", "none")
                            .style("pointer-events", "all");

                    container = svg.append("g")
                            .attr("id","edited");

                    container.append('svg:image')
                        .attr('id', 'croppedimage')
                        .attr('xlink:href', imagedir)
                        .attr("width", rectarray.imagedata.naturalWidth)
                        .attr("height", rectarray.imagedata.naturalHeight)
                        .attr("x", rectWidth)
                        .attr("y", rectHeight);

                    container.append("g")
                            .attr("class", "x axis")
                            .selectAll("line")
                            .data(d3.range(0, width, rectWidth))
                            .enter().append("line")
                            .attr("x1", function (d) {
                                return d;
                            })
                            .attr("y1", 0)
                            .attr("x2", function (d) {
                                return d;
                            })
                            .attr("y2", height);

                    container.append("g")
                            .attr("class", "y axis")
                            .selectAll("line")
                            .data(d3.range(0, height, rectHeight))
                            .enter().append("line")
                            .attr("x1", 0)
                            .attr("y1", function (d) {
                                return d;
                            })
                            .attr("x2", width)
                            .attr("y2", function (d) {
                                return d;
                            });
                    var editedImage = container.append("g")
                            .attr("id","image");
                    
                    for (var layer=0;layer<layers.length;++layer) {
                        for (var r=0;r<numRows;++r) {
                            for (var c=0;c<numCols;++c) {
                                var currentRect = rectarray.rects[r*numCols + c];
                                //var color = "#"+currentRect.col;

                                editedImage.append("g")
                                    .attr("class", "dot " + layers[layer])
                                    .append("rect")
                                    .attr("x", rectWidth+currentRect.x*rectWidth)
                                    .attr("y", rectHeight+currentRect.y*rectHeight)
                                    .attr("width", rectWidth)
                                    .attr("height", rectHeight)
                                    .attr("patternx",c)
                                    .attr("patterny",r)
                                    .style("fill" ,"#"+currentRect.col)
                                    //.style("fill-opacity",0.8)
                                    .on('click', function() {
                                        if (this.style.visiblity != 'hidden') {
                                            this.style.fill = currSelectedColor;
                                        }
                                    });
                            }
                        }
                    }
                    //clear visibility of layers to start
                    var elements = document.querySelectorAll('.dot');
                        for (var ind=0;ind<elements.length;++ind) {
                        elements[ind].style.visibility = 'hidden';
                    }
          //          container.attr("transform", "translate(100,50)scale(4)");  Doest stay this way :((

                    function dottype(d) {
                        d.x = +d.x;
                        d.y = +d.y;
                        return d;
                    }

                    function zoomed() {
                        container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                    }

                    function dragstarted(d) {
                        d3.event.sourceEvent.stopPropagation();
                        d3.select(this).classed("dragging", true);
                    }

                    function dragged(d) {
                        d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
                    }

                    function dragended(d) {
                        d3.select(this).classed("dragging", false);
                    }
                // Color picker button

                    var dialog = document.getElementById('colPick');
                    colorPicker(dialog);
                    var close = document.getElementById('colPickClose');
                    close.style.display = 'block'
                    close.addEventListener('click', function() {
                      dialog.close();
                    });
                    var showModalButton = document.getElementById('color-btn');
                    if (! dialog.showModal) {
                        dialogPolyfill.registerDialog(dialog);
                    }
                    showModalButton.addEventListener('click', function() {
                      dialog.style.width="1000px";
                      dialog.showModal();
                    });
                                        
                    function colorPicker(el) {
                        var paletteBg = 
                            ["#ffebee", "#ffcdd2", "#ef9a9a", "#e57373", "#ef5350", "#f44336", "#e53935", "#d32f2f", 
                            "#c62828", "#b71c1c", "#ff8a80", "#ff5252", "#ff1744", "#d50000", "#fce4ec" , "#f8bbd0", 
                            "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#d81b60", "#c2185b", "#ad1457", "#880e4f", 
                            "#ff80ab", "#ff4081", "#f50057", "#c51162", "#f3e5f5", "#e1bee7", "#ce93d8", "#ba68c8", 
                            "#ab47bc", "#9c27b0", "#8e24aa", "#7b1fa2", "#6a1b9a", "#4a148c", "#ea80fc", "#e040fb", 
                            "#d500f9", "#aa00ff", "#ede7f6", "#d1c4e9", "#b39ddb", "#9575cd", "#7e57c2", "#673ab7", 
                            "#5e35b1", "#512da8", "#4527a0", "#311b92", "#b388ff", "#7c4dff", "#651fff", "#6200ea", 
                            "#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#3949ab", "#303f9f", 
                            "#283593", "#1a237e", "#8c9eff", "#536dfe", "#3d5afe", "#304ffe", "#e3f2fd", "#bbdefb", 
                            "#90caf9", "#64b5f6", "#42a5f5", "#2196f3", "#1e88e5", "#1976d2", "#1565c0", "#0d47a1", 
                            "#82b1ff", "#448aff", "#2979ff", "#2962ff", "#e1f5fe", "#b3e5fc", "#81d4fa", "#4fc3f7", 
                            "#29b6f6", "#03a9f4", "#039be5", "#0288d1", "#0277bd", "#01579b", "#80d8ff", "#40c4ff", 
                            "#00b0ff", "#0091ea", "#e0f7fa", "#b2ebf2", "#80deea", "#4dd0e1", "#26c6da", "#00bcd4", 
                            "#00acc1", "#0097a7", "#00838f", "#006064", "#84ffff", "#18ffff", "#00e5ff", "#00b8d4", 
                            "#e0f2f1", "#b2dfdb", "#80cbc4", "#4db6ac", "#26a69a", "#009688", "#00897b", "#00796b", 
                            "#00695c", "#004d40", "#a7ffeb", "#64ffda", "#1de9b6", "#00bfa5", "#e8f5e9", "#c8e6c9", 
                            "#a5d6a7", "#81c784", "#66bb6a", "#4caf50", "#43a047", "#388e3c", "#2e7d32", "#1b5e20", 
                            "#b9f6ca", "#69f0ae", "#00e676", "#00c853", "#f1f8e9", "#dcedc8", "#c5e1a5", "#aed581", 
                            "#9ccc65", "#8bc34a", "#7cb342", "#689f38", "#558b2f", "#33691e", "#ccff90", "#b2ff59", 
                            "#76ff03", "#64dd17", "#f9fbe7", "#f0f4c3", "#e6ee9c", "#dce775", "#d4e157", "#cddc39", 
                            "#c0ca33", "#afb42b", "#9e9d24", "#827717", "#f4ff81", "#eeff41", "#c6ff00", "#aeea00", 
                            "#fffde7", "#fff9c4", "#fff59d", "#fff176", "#ffee58", "#ffeb3b", "#fdd835", "#fbc02d", 
                            "#f9a825", "#f57f17", "#ffff8d", "#ffff00", "#ffea00", "#ffd600", "#fff8e1", "#ffecb3", 
                            "#ffe082", "#ffd54f", "#ffca28", "#ffc107", "#ffb300", "#ffa000", "#ff8f00", "#ff6f00", 
                            "#ffe57f", "#ffd740", "#ffc400", "#ffab00", "#fff3e0", "#ffe0b2", "#ffcc80", "#ffb74d", 
                            "#ffa726", "#ff9800", "#fb8c00", "#f57c00", "#ef6c00", "#e65100", "#ffd180", "#ffab40", 
                            "#ff9100", "#ff6d00", "#fbe9e7", "#ffccbc", "#ffab91", "#ff8a65", "#ff7043", "#ff5722", 
                            "#f4511e", "#e64a19", "#d84315", "#bf360c", "#ff9e80", "#ff6e40", "#ff3d00", "#dd2c00", 
                            "#efebe9", "#d7ccc8", "#bcaaa4", "#a1887f", "#8d6e63", "#795548", "#6d4c41", "#5d4037", 
                            "#4e342e", "#3e2723", "#757575", "#616161", "#424242", "#212121", "#f5f5f5",  "#e0e0e0", 
                            "#bdbdbd", "#9e9e9e", "#eceff1", "#cfd8dc", "#b0bec5", "#90a4ae", "#78909c", "#607d8b", 
                            "#546e7a", "#455a64", "#37474f", "#263238" ]; 

                           // Local storage set

                           $('el').append('<input id="clipBoard" type="text"/>');
                           // palette appending 
                           for(var i =0; paletteBg.length > i; i++){
                             $(el).append('<div class="palette" style="background: '+paletteBg[i]+'"><span class="code">'+paletteBg[i]+'</span><span class="close">&times</span></div>');
                           }
                           // card open 
                           $(el).on("click", '.palette', function(e){  
                              $(this).addClass("open");
                              var bgColor = $(this).find('.code').text().trim();// Palette Color

                             $('#clipBoard').val(bgColor); // local storage
                             // copy to clipboard
                             e.preventDefault();
                             //document.execCommand('copy', false, document.getElementById('clipBoard').select());
                             console.log(bgColor);
                             currSelectedColor = bgColor;
                             colorBrushUI.style.backgroundColor = currSelectedColor;
                           });
                           // close
                           $(document).on("click", '.close', function(){
                             $(this).parent().removeClass("open");
                           });
                    }


                    //Hook up to spin box
                    layerName = document.querySelectorAll('#propertyType')[0];

                    layerName.addEventListener('change', function() {
                        console.log(layerName.value);
                        var currLayer = Number(layerName.value) || 0;
                        if(currLayer && currLayer>0 && currLayer<101)
                        {
                            //clear layers
                            var elements = document.querySelectorAll('.dot');
                            for (var ind=0;ind<elements.length;++ind) {
                                elements[ind].style.visibility = 'hidden';
                            }
                            //display layer
                            switch(currLayer) {
                                case 1:
                                    //document.querySelectorAll('.base')[0].style.visibility = 'hidden';
                                    break;
                                case 3:
                                    var elements = document.querySelectorAll('.objects');
                                    for (var ind=0;ind<elements.length;++ind) {
                                        elements[ind].style.visibility = 'visible';
                                    }
                                    break;
                                case 6:
                                    var elements = document.querySelectorAll('.pedestrian');
                                    for (var ind=0;ind<elements.length;++ind) {
                                        elements[ind].style.visibility = 'visible';
                                    }
                                    break;
                                case 7:
                                    var elements = document.querySelectorAll('.car');
                                    for (var ind=0;ind<elements.length;++ind) {
                                        elements[ind].style.visibility = 'visible';
                                    }
                                    break;
                                case 10:
                                    var elements = document.querySelectorAll('.signs');
                                    for (var ind=0;ind<elements.length;++ind) {
                                        elements[ind].style.visibility = 'visible';
                                    }
                                    break;
                                case 11:
                                    var elements = document.querySelectorAll('.traffic-lights');
                                    for (var ind=0;ind<elements.length;++ind) {
                                        elements[ind].style.visibility = 'visible';
                                    }
                                    break;
                            }
                        }  
                    });


                // Save button    
                    var saveEditedImage = document.querySelector('#saveEditedImage');
                        saveEditedImage.addEventListener('click', function() {

                        resultEditedImage = [];
                        for (var layer=0;layer<layers.length;++layer) {
                            var rectArraySave = [];
                            var imagedataArray = [];
                                imagedataArray = {"naturalWidth" : document.getElementById("image").getBBox().width,
                                     "naturalHeight" :  document.getElementById("image").getBBox().height,
                                     "numCols" : numCols, // defined in scope at creation
                                     "numRows" : numRows}; // defined in scope at creation
                            
                            var im = document.getElementById("image");
                            var listofdots = im.getElementsByClassName(layers[layer]);
                            
                            for(var i = 0; i < listofdots.length; i++)
                            {
                                var elem = listofdots[0].childNodes[0];
                                
                                rectArraySave.push({ "col" : document.defaultView.getComputedStyle(elem, null).getPropertyValue("fill"), 
                                    "x" : elem.getAttribute("patternx"), "y" : elem.getAttribute("patterny")});
                            }
                            resultEditedImage.push({"imagedata" : imagedataArray, "rects" : rectArraySave});
                        }

                        var fileName = document.querySelectorAll('#filename')[0].value;
                        //upload and save arrays.
                        $.ajax({
                            url: "/uploadfinalarray",
                            type: "post",
                            dataType : "json",
                            contentType: "application/json; charset=utf-8",
                            data: JSON.stringify({"name": fileName, "array": resultEditedImage}),
                            success: function(response) {
                            }
                        });
                        console.log(fileName);
                        console.log(JSON.stringify(resultEditedImage));
                    });    
                }
            }); 
        }
    }); 

});
