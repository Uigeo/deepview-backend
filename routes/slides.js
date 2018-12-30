var express = require('express');
var router = express.Router();
var conn = require('../dbcon');


/* GET users listing. */
router.get('/get/:limit', function(req, res, next) {
  let sql = 'SELECT * FROM slides LIMIT $1';
  conn.query( sql, [req.params.limit], (err, re)=>{
    if(err){
      console.log(err);
    }else{
      res.json(re.rows);
    }
  });
});

router.get('/get/:limit/:offset', function(req, res, next) {
  let sql = 'SELECT * FROM slides LIMIT $1 OFFSET $2';
  conn.query( sql, [req.params.limit, req.params.offset] , (err, re)=>{
    if(err){
      console.log(err);
    }else{
      res.json(re.rows);
    }
  });
});

router.get('/get/:limit/:offset/:orderby/:range', function(req, res, next) {
  const query = {
    name: 'get_slide_orderby',
    text: 'SELECT * FROM slides ORDER BY $1 '+ req.params.range + ' LIMIT $2 OFFSET $3',
    values: [req.params.orderby, req.params.limit, req.params.offset ]
  }

  conn.query( query, (err, re)=>{
    if(err){
      console.log(err);
    }
    else{
      res.json(re.rows);
    }   
  });
});

router.get( '/total', function(req, res, next){
  var sql = "SELECT count(*) FROM slides";
  conn.query(sql, (err, re)=>{
    if(err){
      console.log(err);
    }
    res.json(re.rows[0].count);
  });
});

//"\'%"+ req.params.keyword + "%\'"
router.get('/search/:pivot/:keyword/:limit', (req, res, next)=>{
  const text = "SELECT * FROM slides WHERE "+ req.params.pivot +" LIKE '%"+ req.params.keyword +"%' LIMIT "+ req.params.limit;
  conn.query(text, (err, response)=>{
    if(err){
      console.log(err);
    }else{
      res.json(response.rows);
    }
  });
}); 

module.exports = router;