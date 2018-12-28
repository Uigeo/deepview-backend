const {Pool, Client} = require('pg');
const dbconfig = require('./dbconfig.json');
var conn = new Client( dbconfig);

conn.connect();

module.exports=conn;