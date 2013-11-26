// if has border
function detect(image, option){
    if(image){

        // 基本配置
        option = option || {}
        option.deep = option.deep || 3;
        option.threshold = option.threshold || 230;


        var hasTop = hasNoise(image, option),

            hasRight = (function(){
                option.direction = 'right';
                return hasNoise(image, option);
            })(),

            hasBottom = (function(){
                option.direction = 'bottom';
                return hasNoise(image, option);
            })(),

            hasLeft = (function(){
                option.direction = 'left';
                return hasNoise(image, option);
            })();

        return {
            top: hasTop,
            right: hasRight,
            bottom: hasBottom,
            left: hasLeft
        };
    }
}

// getImage
function getImageSrc(){
    var srcArray = [],
        images = document.querySelectorAll('img');

    for(var i = 0, j = images.length; i<j; i++){
        if(images[i].src && images[i].src != ''){
            srcArray.push(images[i].src);
        }
    }
    return srcArray;
}

// get pixel array
function getPixelArray(image){

    var canvas = document.createElement('canvas'),
        ctx = canvas && canvas.getContext && canvas.getContext('2d'),
        imageData, pixelArray;

    var img_w = image.width;
    var img_h = image.height;

    canvas.width = img_w;
    canvas.height = img_h;

    if (!ctx) return;

    ctx.drawImage(image, 0, 0);

    imageData = ctx.getImageData(0, 0, img_w, img_h);
    pixelArray = imageData.data;

    // return pixelArray /* phantom doesn't support Uint8ClampedArray type */;
    return Array.prototype.slice.call(pixelArray) || [];
}

// get row array of pixels
function getRowArray(image, row_num){
    var pixelArray = getPixelArray(image),
        img_width = image.width;

    return pixelArray.slice(row_num * img_width * 4, (row_num + 1) * img_width * 4);
}

// get col array of pixels
function getColArray(image, col_num){
    var img_height = image.height;

    var col_array = [];
    for(var row_num = 0; row_num < img_height - 1; row_num++){
        col_array.push(getRowArray(image, row_num)[col_num]);
    }

    return col_array;
}

// if has noise
function hasNoise(image, option){

    option.direction = option.direction || 'top';  // top, right, bottom, left

    var startIndex = 0, endIndex = option.deep, getArray;

    // set start and end index
    if(option.direction == 'right'){
        startIndex = image.width - option.deep;
        endIndex = image.width;
    }
    if(option.direction == 'bottom'){
        startIndex = image.height - option.deep;
        endIndex = image.height;
    }

    // set get array function
    if(option.direction == 'top' || option.direction == 'bottom'){
        getArray = getRowArray;
    }
    if(option.direction == 'left' || option.direction == 'right'){
        getArray = getColArray;
    }

    var noiseFlag, array, hasNoise;
    for(var deep = startIndex; deep < endIndex; deep++){

        array = getArray(image, deep);
        hasNoise = (function(array, threshold){
            for(var i = 0, j = array.length; i<j; i++){
                if(array[i] < threshold){
                    return true;
                }
            }
            return false;
        })(array, option.threshold);

        if(deep == startIndex){
            noiseFlag = hasNoise;
        }

        if(noiseFlag !== hasNoise){
            return true;
        }
    }
    return false;
}