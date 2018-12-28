var express = require('express');
var router = express.Router();
var conn = require('../dbcon');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.params);
  res.cookie('sssss', 'ddfdfdfdfdfdf123124');
  res.send('Hello');
});


router.post('/login', (req, res, next)=>{ 
  var id = req.body.id;
  var pw = req.body.pw;
  var sql = `SELECT * FROM users WHERE userid=$1 AND password=$2;`;
  conn.query(sql, [id, pw], (err, users, fields)=>{
      if(err){
          console.log("error___");
          console.error('error connecting: ' + err.stack);
          return;
      } 
      else if (users.rows.length > 0) {
          console.log("login successful");
          
          req.session.userid = users.rows[0].userid;
          req.session.name = users.rows[0].name;
          console.log(req.session.id);
          res.cookie( 'sid' ,req.session.id);
          
      }else{
          console.log("login fail");
      }
      res.json({ users : users.rows });
  });
});


router.get('/logout', function (req, res) {
  delete req.session.userid;
  delete req.session.name;
  
  res.cookie('sid', null);
});

module.exports = router;
