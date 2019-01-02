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
    SPD : "SELECT diagnosis::text as name, count(slideid)::integer as value FROM slides GROUP BY diagnosis ORDER BY diagnosis",
    SPH : "SELECT hospital as name, count(slideid)::integer as value FROM slides GROUP BY hospital ORDER BY hospital",
    SPDS : `SELECT * FROM crosstab ( 
      'SELECT diagnosis::text, hospital ,count(slideid) AS count
      FROM slides
      GROUP BY diagnosis, hospital
       ORDER BY 1, 2'
       ) as ct("diagnosis" text, "AS" bigint, "HY" bigint, "KR" bigint, "SE" bigint)
  `,
    SPYS : `SELECT * FROM crosstab ( 
      'SELECT EXTRACT(year from upload) as year , hospital, count(slideid) AS count
      FROM slides
      GROUP BY EXTRACT(year from upload), hospital
       ORDER BY 1, 2'
       ) as ct("year" double precision, "AS" bigint, "HY" bigint, "KR" bigint, "SE" bigint)`,
    SPHS : `SELECT * FROM crosstab ( 
      'SELECT  hospital, diagnosis ,count(slideid) AS count
      FROM slides
      GROUP BY  hospital, diagnosis
       ORDER BY 1, 2'
       ) as ct("hospital" varchar(255), "G1" bigint, "G2" bigint, "G3" bigint, "G4" bigint, "G5" bigint)`
  };
  

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
router.get('/search/:pivot/:keyword/:limit/:offset', (req, res, next)=>{
  const text = "SELECT * FROM slides WHERE "+ req.params.pivot +" LIKE '%"+ req.params.keyword +"%' LIMIT "+ req.params.limit + ' OFFSET ' + req.params.offset;
  conn.query(text, (err, response)=>{
    if(err){
      console.log(err);
    }else{
      res.json(response.rows);
    }
  });
}); 

module.exports = router;