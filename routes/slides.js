var express = require('express');
var router = express.Router();
var conn = require('../dbcon');


router.get('/get/:limit', function(req, res, next) {
  let sql = 'SELECT slide AS slideid, hospital, upload, diagnosis, stain, imgpath FROM slides LIMIT $1';
  conn.query( sql, [req.params.limit], (err, re)=>{
    if(err){
      console.log(err);
    }else{
      res.json(re.rows);
    }
  });
});

router.get('/get/:limit/:offset', function(req, res, next) {
  let sql = 'SELECT slide AS slideid, hospital, upload, diagnosis, stain, imgpath FROM slides FROM slides LIMIT $1 OFFSET $2';
  conn.query( sql, [req.params.limit, req.params.offset] , (err, re)=>{
    if(err){
      console.log(err);
    }else{
      res.json(re.rows);
    }
  });
});

router.get('/get/:limit/:offset/:orderby/:order', function(req, res, next) {
  const {orderby, order, limit, offset} = req.params;
  const query = {
    name: 'get_slide_orderby',
    text: 'SELECT * FROM slides ORDER BY '+ orderby + ' ' + order +' OFFSET ' + offset  + ' LIMIT ' + limit,
    values: [ ]
  }
  conn.query( query.text)
    .then( re => {res.json(re.rows);} )
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
    SPY : "SELECT EXTRACT('YEAR' from upload) as year, count(slide) FROM slides GROUP BY EXTRACT('YEAR' from upload) ORDER BY 1 ",
    SPD : "SELECT diagnosis::text as name, count(slide)::integer as value FROM slides GROUP BY diagnosis ORDER BY diagnosis",
    SPH : "SELECT hospital as name, count(slide)::integer as value FROM slides GROUP BY hospital ORDER BY hospital",
    SPDS : `SELECT * FROM crosstab ( 
      'SELECT diagnosis::text, hospital ,count(slide) AS count
      FROM slides
      GROUP BY diagnosis, hospital
       ORDER BY 1, 2'
       ) as ct("diagnosis" text, "HYUMC" bigint, "KBSMC" bigint, "KUMC" bigint, "SMC" bigint)
  `,
    SPYS : `SELECT * FROM crosstab ( 
      'select  y.year, h.hospital, count(t.slide) 
      from (select distinct hospital from slides) h cross join
           (select distinct EXTRACT(year from upload) as year from slides) y left join
            slides t
        on t.hospital = h.hospital and EXTRACT(year from t.upload) = y.year GROUP BY y.year, h.hospital ORDER BY 1, 2;'
       ) as ct("year" double precision, "HYUMC" bigint, "KBSMC" bigint, "KUMC" bigint, "SMC" bigint);`,
    SPHS : `SELECT * FROM crosstab ( 
      'select h.hospital, y.year, count(t.slide) 
      from (select distinct hospital from slides) h cross join
           (select distinct EXTRACT(year from upload) as year from slides) y left join
            slides t
        on t.hospital = h.hospital and EXTRACT(year from t.upload) = y.year GROUP BY h.hospital, y.year ORDER BY 1, 2;'
       ) as ct("hospital" varchar(255), "2016" bigint, "2017" bigint, "2018" bigint);`
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
  const text = "SELECT slide, hospital, upload, diagnosis, stain, imgpath FROM slides WHERE "+ req.params.pivot +" LIKE '%"+ req.params.keyword +"%' LIMIT "+ req.params.limit + ' OFFSET ' + req.params.offset;
  conn.query(text, (err, response)=>{
    if(err){
      console.log(err);
    }else{
      res.json(response.rows);
    }
  });
}); 

module.exports = router;