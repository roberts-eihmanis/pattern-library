var cropper;
var preview;
var image;
var resultArray = [];
var uniqueCol = [];
var numCols = 1;
var numRows = 1;
var saveenable = 0; // if no errors form can be submited

window.addEventListener('DOMContentLoaded', function () {
    image = document.querySelector('#theImage');
    preview = document.querySelectorAll('.previewImage')[0];

    cropper = new Cropper(image, {
        movable: false,
        zoomable: false,
        rotatable: false,
        scalable: false,
        ready: function () {
            var clone = this.cloneNode();

            clone.className = '';
            clone.style.cssText = (
            'display: block;' +
            'width: 100%;' +
            'min-width: 0;' +
            'min-height: 0;' +
            'max-width: none;' +
            'max-height: none;'
            );
        preview.appendChild(clone.cloneNode());
        },
        crop: function (e) {
            var data = e.detail;
            var cropper = this.cropper;
            var imageData = cropper.getImageData();
            var previewAspectRatio = data.width / data.height;

            var previewImage = preview.getElementsByTagName('img').item(0);
            var previewWidth = preview.offsetWidth;
            var previewHeight = previewWidth / previewAspectRatio;
            var imageScaledRatio = data.width / previewWidth;

            preview.style.height = previewHeight + 'px';
            previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
            previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
            previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
            previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
        }
    });

    var rows = document.querySelectorAll('.row-boxes')[0];
    console.log("got rows: " + rows);
    rows.addEventListener('change', function() {
        console.log(rows.value);
        var rowtest = Number(rows.value) || 0;
        if(rowtest && rowtest>0 && rowtest<101)
        {
            //clear lines
            var elements = document.getElementsByClassName('cropper-dashed dashed-h');
            console.log("intances of hlines: " + elements);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            var moves = document.getElementsByClassName('cropper-face cropper-move');
            while(moves.length > 0){
                moves[0].parentNode.removeChild(moves[0]);
            }
            //add new ones
            console.log("changing rows");
            numRows = this.value;
            var $ccb = $('.cropper-crop-box');
            var cbHeight = $ccb.height();
            var cbWidth = $ccb.width();

            var offset = (100 / numRows);
            var increment = offset;
            for (i=0;i<numRows-1;++i) {
                $ccb.append(createHorizontalLine(offset));
                offset += increment;
                console.log("Added another row");
            }
            $ccb.append(createMove());
        } else document.querySelectorAll('.row-boxes')[0].value = 1; 
    });

    var cols = document.querySelectorAll('.column-boxes')[0];
    console.log("got cols: " + cols);
    cols.addEventListener('change', function() {
        console.log(cols.value);
        var coltest = Number(cols.value) || 0;
        if(coltest && coltest>0 && coltest<101)
        {
            //clear lines
            var elements = document.getElementsByClassName('cropper-dashed dashed-v');
            console.log("intances of vlines: " + elements);
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
            var moves = document.getElementsByClassName('cropper-face cropper-move');
            while(moves.length > 0){
                moves[0].parentNode.removeChild(moves[0]);
            }
            //add new ones
            console.log("changing cols");
            numCols = this.value;
            var $ccb = $('.cropper-crop-box');
            var cbHeight = $ccb.height();
            var cbWidth = $ccb.width();

            var offset = (100 / numCols);
            var increment = offset;
            for (i=0;i<numCols-1;++i) {
                $ccb.append(createVerticalLine(offset));
                offset += increment;
                console.log("Added another column");
            }
            $ccb.append(createMove());
        } else document.querySelectorAll('.column-boxes')[0].value = 1;
    });
});

function createVerticalLine(offset) {
    return $("<span />", {
        "class": "cropper-dashed dashed-v",
        "style": "left:" + offset + "%"
    });
}
function createHorizontalLine(offset) {
    return $("<span />", {
        "class": "cropper-dashed dashed-h",
        "style": "top:" + offset + "%"
    });
}

function createMove() {
    return $("<span />", {
        "class": "cropper-face cropper-move",
        "data-action": "all"
    });
}


function getAverageColourAsRGB(img) 
{
    var canvas = document.createElement('canvas'),
            context = canvas.getContext && canvas.getContext('2d'),
            rgb = {r:102,g:102,b:102}, // Set a base colour as a fallback for non-compliant browsers
            pixelInterval = 3, // Rather than inspect every single pixel in the image inspect every 5th pixel
            count = 0,
            i = -4,
            data, length;

    // On CONTEXT error return the base colour for non-compliant browsers
    if (!context) { return rgb; }

    // Set Image {height, width} -> Canvas element
    var height = canvas.height = img.naturalHeight || img.offsetHeight || img.height,
        width = canvas.width = img.naturalWidth || img.offsetWidth || img.width;

    // Place Image on cavas
    context.drawImage(img, 0, 0);

    // Exp. Cross Domain security check 
    try { data = context.getImageData(0, 0, width, height);} 
    catch(e) { alert(e); return rgb; }
    
    //
    data = data.data;
    length = data.length;
    while ((i += pixelInterval * 4) < length) {
        count++;
        rgb.r += data[i];
        rgb.g += data[i+1];
        rgb.b += data[i+2];
    }

    // floor the average values to give correct rgb values (ie: round number values)
    rgb.r = Math.floor(rgb.r/count);
    rgb.g = Math.floor(rgb.g/count);
    rgb.b = Math.floor(rgb.b/count);
      
    var hexcol = ((rgb.b | rgb.g << 8 | rgb.r << 16) | 1 << 24).toString(16).slice(1);
    
    // append uique value to array
    position = uniqueCol.indexOf(hexcol);
    console.log(position, hexcol);
    if (uniqueCol.indexOf(hexcol) === -1) {
        uniqueCol.push(hexcol);
    } 
    
    return hexcol;
    //return rgb
    // return img, height, width;
}


$(function(){
    $('#submit-button').click(function(e){
        e.preventDefault();
        console.log('button clicked');
            

        var slicedImageTable = [];

        var croppedCanvas =  cropper.getCroppedCanvas();
        console.log("cropper canvas: " + croppedCanvas);
        var croppedImage = new Image();
        console.log("croppedImage");

        croppedImage.onload = function() {
            console.log("onload called");
            var _canvas = document.createElement('canvas');
            var dx = _canvas.width = croppedImage.width / numCols;
            var dy = _canvas.height = croppedImage.height / numRows;
            var ctx = _canvas.getContext("2d");
            var imagedataArray = [];
            var rectArray = [];

            imagedataArray = {"naturalWidth" : croppedImage.width,
                                 "naturalHeight" :  croppedImage.height,
                                 "numCols" : numCols, 
                                 "numRows" : numRows};
            for (var row = 0; row < numRows; row++) {
                for (var col = 0; col < numCols; col++) {
                    ctx.drawImage(croppedImage, dx * col, dy * row, dx, dy, 0, 0, dx, dy); // Take snapshot of a part of the source image.
                    ctx.strokeRect(0, 0, dx, dy); // Place a border around each tile.
                    slicedImageTable.push( _canvas.toDataURL() ); // Convert the canvas slice into a local image.
                    console.log("adding element");
                    //change this tio cooperate with SVG Rect
                    //integrate that with d3 to render grid and color

                    rectArray.push({ "col" : getAverageColourAsRGB(_canvas), "x" : col, "y" : row});
                }
            }

            resultArray = {"imagedata" : imagedataArray, "rects" : rectArray};
            alert('Unique colors: '+ uniqueCol.length);
            
            var data = croppedCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
            console.log("data: " + data);
            var byteString;
            if (data.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(data.split(',')[1]);
            else
                byteString = unescape(data.split(',')[1]);

            // separate out the mime component
            var mimeString = data.split(',')[0].split(':')[1].split(';')[0];

            // write the bytes of the string to a typed array
            var ia = new Uint8Array(byteString.length);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            croppedImage = new Blob([ia], {type:mimeString});
            console.log("croppedImage: " + croppedImage);

            var fd = new FormData();
            fd.append('file', croppedImage);

            $.ajax({
                type: 'POST',
                url: '/patterns/uploadfile',
                data: fd,
                contentType: false,
                processData: false,
                success: function(data) {
                    console.log('uploaded cropped image');
                }
            });
            $.ajax({
                url: "/patterns/uploadrectarray",
                type: "post",
                dataType : "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"array": resultArray}),
                success: function(response) {
                    console.log("sent array!");
                }
            }); 
            $.ajax({
                url: "/patterns/getediturl",
                type: "post",
                success: function(response) {
                   window.location.href = response.redirect;
                }
            }); 
        };
        croppedImage.src = croppedCanvas.toDataURL();
    });
});