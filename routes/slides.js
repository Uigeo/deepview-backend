var express = require('express');
var router = express.Router();
var conn = require('../dbcon');



/* GET users listing. */
router.get('/:limit', function(req, res, next) {
  console.log(req.params.limit);
  conn.query( 'SELECT * FROM slides LIMIT ' + req.params.limit, (err, re)=>{
    
  res.json(re.rows);
       
  });
});

router.get('/:limit/:offset', function(req, res, next) {
  console.log(req.params.limit);
  conn.query( 'SELECT * FROM slides LIMIT ' + req.params.limit + " OFFSET " + req.params.offset, (err, re)=>{
    
  res.json(re.rows);
       
  });
});

router.get('/:limit/:offset/:orderby/:range', function(req, res, next) {
  console.log(req.params.limit);
  conn.query( 'SELECT * FROM slides LIMIT ' + req.params.limit + " OFFSET " + req.params.offset, + " ORDER BY " + req.params.orderby + " " + req.params.range, (err, re)=>{
  res.json(re.rows);   
  });
});

//"\'%"+ req.params.keyword + "%\'"
router.get('/search/:pivot/:keyword/:limit', (req, res, next)=>{
  
  const text = "SELECT * FROM slides WHERE "+ req.params.pivot +" LIKE '%"+ req.params.keyword +"%' LIMIT "+ req.params.limit;
  console.log(conn);
  conn.query(text, (err, response)=>{
    if(err){
      console.log(err);
    }else{
      res.json(response.rows);
    }
  });
}); 

module.exports = router;