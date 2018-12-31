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
  const {orderby, range, limit, offset} = req.params;
  const query = {
    name: 'get_slide_orderby',
    text: 'SELECT * FROM slides ORDER BY '+ orderby + ' ' + range +' OFFSET ' + offset  + ' LIMIT ' + limit,
    values: [ ]
  }
  console.log(query);
  conn.query( query.text)
    .then( re => { console.log(re.rows) ;res.json(re.rows);} )
    .catch(e => console.error(e.stack) ); 

  
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

router.get('/chart/:type', (req, res, next)=>{
  const { type } = req.params;
  console.log(type);
  const sql = {
    SPY : "SELECT EXTRACT('YEAR' from upload) as year, count(slideid) FROM slides GROUP BY EXTRACT('YEAR' from upload) ORDER BY 1 ",
    SPD : "SELECT diagnosis, count(slideid) FROM slides GROUP BY diagnosis ORDER BY diagnosis",
    SPH : "SELECT hospital as name, count(slideid)::integer as value FROM slides GROUP BY hospital ORDER BY hospital",
    SPDS : `SELECT * FROM crosstab ( 
      'SELECT EXTRACT(year from upload) as year , diagnosis, count(slideid) AS count
      FROM slides
      GROUP BY EXTRACT(year from upload), diagnosis
       ORDER BY 1, 2'
       ) as ct("year" double precision, "1" bigint, "2" bigint, "3" bigint, "4" bigint, "5" bigint)`,
    SPYS : `SELECT * FROM crosstab ( 
      'SELECT EXTRACT(year from upload) as year , hospital, count(slideid) AS count
      FROM slides
      GROUP BY EXTRACT(year from upload), hospital
       ORDER BY 1, 2'
       ) as ct("year" double precision, "AS" bigint, "HY" bigint, "KR" bigint, "SE" bigint)`
  }

  conn.query(sql[type]).then(
    re => { res.json(re.rows) }
  )
  .catch(
    error => {
      console.error(error);
    }
  )
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