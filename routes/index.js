var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/ttt', function(req,res,next) {
  res.render('ttt_intro', {title: 'tic tac toe'})
});

router.post('/ttt', function(req,res,next) {
  console.log(req.body)
  var name = req.body.name
  var dateObj = new Date();
  var month = dateObj.getUTCMonth() + 1; //months from 1-12
  var day = dateObj.getUTCDate();
  var year = dateObj.getUTCFullYear();
  
  var date = month + "/" + day + "/" + year;
  
  res.render('ttt_intro_post', {title: 'tic tac toe', name: name, date: date })
});


module.exports = router;
