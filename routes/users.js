var express = require('express');
var router = express.Router();
var conn = require('../dbcon');


router.get('/logout', function(req, res, next){
  delete req.session.userid;
  delete req.session.name;
  res.json({ logout : true });
})

router.post('/login', (req, res, next)=>{ 
  var id = req.body.id;
  var pw = req.body.pw;
  console.log(req.session.wrong);
  req.session.wrong = (req.session.wrong) ? req.session.wrong+1 : 1 ;
  var sql = `SELECT * FROM users WHERE userid=$1 AND password=$2;`;
  conn.query(sql, [id, pw], (err, users, fields)=>{
      if(err){
          console.log("error___");
          console.error('error connecting: ' + err.stack);
          return;
      }
      else if(req.session.wrong >= 5){
          console.log("5 wrongs!!");
      } 
      else if (users.rows.length > 0) {
          console.log("login successful");
          
          req.session.userid = users.rows[0].userid;
          req.session.name = users.rows[0].name;
          req.session.wrong = 0;
          res.json({ user : users.rows[0] });
      }
      else{
          console.log("login fail", req.session.wrong);
          
          res.json({ user : null, wrong : req.session.wrong });
      }
      
  });
});



module.exports = router;
