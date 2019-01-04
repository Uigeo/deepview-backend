
const sharp = require('sharp');
const fs = require('fs');
//CMU-1-Small-Region.svs
//SMC-008-00183-16-400-017.svs

var filename = '/home/hello/Desktop/CMU-1-Small-Region.svs';
var outputname = '/home/hello/Desktop/uo.zip';

const readStream = fs.createReadStream(filename);
const writeStream = fs.createWriteStream(outputname);

sharp(filename).metadata().then(
    metadata =>{ 'metadata', console.log(metadata)}
);

// sharp(filename).limitInputPixels(false).resize({height : 3000, width : 1000}).toBuffer().then(
//     data => { console.log(data)}
// ).catch(
//     err => {console.log(err)}
// );

sharp(filename).limitInputPixels(false).jpeg().tile({
    size : 128,
    container : 'zip',
    layout : 'zoomify'
}).toFile(outputname).then().catch(
    err=>{console.log(err)}
);


// sharp(filename).limitInputPixels(false).png().tile({size:5000});

// writeStream.pipe(sharp);