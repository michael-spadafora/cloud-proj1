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

  gb = []
  for (var i = 0; i < 9; i++) 
    gb.push(' ')
  //check columns
  var wld = ' '
  for (var i = 0; i < 3; i++) {
    if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="O")
      wld = 'O'
    if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="X")
      wld = 'X'
  }
  //check rows
  for (var i = 0; i < 9; i=i+3) {
    if (gb[i]==gb[i+1] && gb[i+1]==gb[i+2] && gb[i+1]=='O')
      wld = 'O'
    if (gb[i]==gb[i+1] && gb[i+1]==gb[i+2] && gb[i+1]=='X')
      wld = 'X'
  }
  // check diagonals
  if (gb[0]==gb[4] && gb[4]==gb[8])
    wld = gb[0]

  if (gb[2]==gb[4] && gb[4]==gb[6])
    wld = gb[0]
  
  var date = month + "/" + day + "/" + year;
  
  res.render('ttt_intro_post', {title: 'tic tac toe', name: name, date: date, grid:gb, winner:wld })
});

// TODO: gameplay
router.get('/ttt/play', function(req,res,next) {
  gb = []
  for (var i = 0; i < 9; i++) 
    gb.push(' ')
  //check columns
  var wld = ' '
  for (var i = 0; i < 3; i++) {
    if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="O")
      wld = 'O'
    if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="X")
      wld = 'X'
  }
  //check rows
  for (var i = 0; i < 9; i=i+3) {
    if (gb[i]==gb[i+1] && gb[i+1]==gb[i+2] && gb[i+1]=='O')
      wld = 'O'
    if (gb[i]==gb[i+1] && gb[i+1]==gb[i+2] && gb[i+1]=='X')
      wld = 'X'
  }
  // check diagonals
  if (gb[0]==gb[4] && gb[4]==gb[8])
    wld = gb[0]

  if (gb[2]==gb[4] && gb[4]==gb[6])
    wld = gb[0]

  res.render('ttt_game', {title: 'tic tac toe', grid: gb, winner: wld})
});

module.exports = router;
