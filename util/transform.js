const fs = require('fs');
const sharp = require('sharp');

module.exports = function transform(path, format, width, height){
    const readStream = fs.createReadStream(path);
    
    let trans = sharp();

    if(format) {
        trans = trans.toFormat(format);
    }

    if (width || height) {
        trans = trans.resize(width, height);
    }

    return readStream.pipe(trans);
}