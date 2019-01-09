const pwhash = require('password-hash');


var p1 =  pwhash.generate('mug4019')

console.log(p1);

console.log( pwhash.verify('mug4019', p1) );