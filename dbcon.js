const {Pool, Client} = require('pg');
const dbconfig = require('./dbconfig.json');
var conn = new Client( dbconfig);

conn.connect().then(
    info => {console.log("Success to connect to DB", info);}
).catch(
    err => {console.log("Fail to connect to DB", err)}
);


module.exports=conn;