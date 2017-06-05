/* global croppedCanvas */
var croppedCanvas = document.createElement('canvas');

var imagedataArray = [];
var rectArray = [];

var patternname = document.querySelectorAll('.patter-name')[0];


// Create blank daya for new image
$(function () {
    $('#new-pattern').click(function (e) {
        var rows = $('.row-boxes').val();
        var cols = $('.column-boxes').val();
        e.preventDefault();
        console.log('button clicked');

        var rowtest = Number(rows) || 0;
        var coltest = Number(cols) || 0;
        console.log("c:"+ coltest, " r:"+rowtest);

        if( (rowtest && rowtest>0 && rowtest<101)  &&
                (rowtest && rowtest>0 && rowtest<101))
        {
// ------------------------
            var tileSize =15; // size of the tile in the editor
            var imagedataArray = [];
            var rectArray = [];
            imagedataArray = {"naturalWidth": tileSize*coltest,
                "naturalHeight": tileSize*rowtest,
                "numCols": coltest,
                "numRows": rowtest};

            for (var row = 0; row < imagedataArray.numRows; row++) {
                for (var col = 0; col < imagedataArray.numCols; col++) {
                    rectArray.push({"col": "000030", "x": col, "y": row});
                } // for
            } // for

            resultArray = {"imagedata": imagedataArray, "rects": rectArray, "row_number": rows, "col_number": cols };

    //----------------


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
            } // for

            croppedImage = new Blob([ia], {type: mimeString});
            console.log("croppedImage: " + croppedImage);

            var fd = new FormData();
            fd.append('file', croppedImage);

            $.ajax({
                type: 'POST',
                url: '/patterns/uploadfile',
                data: fd,
                contentType: false,
                processData: false,
                success: function (data) {
                    $.ajax({
                        url: "/patterns/uploadrectarray",
                        type: "post",
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({"array": resultArray}),
                        success: function (response) {
                            console.log("sent array!");
                        } //function
                    }); // $.ajax
                    console.log('uploaded cropped image');
                } // function
            }); // $.ajax
            
            $.ajax({
                url: "/patterns/getediturl",
                type: "post",
                success: function (response) {
                    window.location.replace('/patterns/getediturl')
                } //function
            });// $.ajax
        } // if
        
    }); // $(new-pattern)
    croppedImage.src = croppedCanvas.toDataURL();
});

Dropzone.options.postimage = {
    maxFiles: 1,
    accept: function (file, done) {
        console.log("uploaded");
        done();
    },
    init: function () {
        console.log("in drop zone ");
        this.on("complete", function (file) {
            if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {

                console.log("requesting configureimage");

                $.ajax({
                    url: "/getconfigureurl",
                    type: "post",
                    success: function (response) {
                        window.location.href = response.redirect;
                    }
                });
            }
            this.on("maxfilesexceeded", function (file) {
                alert("No more files please!");
            });
        });
    }
};


