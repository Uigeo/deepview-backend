var express = require('express');
var router = express.Router();
var conn = require('../dbcon');
const hashedpw = require('password-hash');

router.get('/logout', function(req, res, next){
  delete req.session.userid;
  delete req.session.name;
  res.json({ logout : true });
})

router.post('/signup', (req, res, next)=>{
    var id = req.body.id;
    var pw = req.body.pw;
    var name = req.body.name;
    pw = hashedpw.generate(pw);
    var query = {
        name: 'new account',
        text: 'INSERT INTO users (userid, password, name) VALUES  ( $1 , $2, $3 ) ',
        values: [ id, pw, name ]
      };
      
    conn.query(query).then(
        response => {
            console.log(response);
            res.json({result : 'success'});
        }
    ).catch(
        err => {
            console.log(err);
            res.json({result : 'fail'});
        }
    );
})

router.post('/login', (req, res, next)=>{
  console.log(req.sessionID);
  var id = req.body.id;
  var pw = req.body.pw;
  console.log(req.session.wrong);
  req.session.wrong = (req.session.wrong) ? req.session.wrong+1 : 1 ;
  var sql = `SELECT * FROM users WHERE userid=$1`;
  conn.query(sql, [id], (err, users, fields)=>{
      if(err){
          console.log("error___");
          console.error('error connecting: ' + err.stack);
          return;
      }
      else if(req.session.wrong >= 5){
          console.log("5 wrongs!!");
      } 
      else if (users.rows.length > 0 && hashedpw.verify(pw, users.rows[0].password )) {
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
