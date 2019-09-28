var express = require('express');
var UserController = require('../controllers/userController')
var mail = require('../controllers/mailController')

var MongoClient = require('mongodb').MongoClient
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



var userController = new UserController();


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
router.post('/ttt/play', function(req,res,next) {
  console.log(req.body)
  gb = req.body.grid
  //accept "move" property: int 0-8
  //if null, or square is taken, just return current.
  //else, accept the move to the gameboard, then make computer move

  //game state
  //save state of current game somehow. maybe write to text file?
  //how can i save a variable externally? 

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
  
  let ret = {
    grid: gb,
    winner: wld
  }

  res.send(ret)
  // res.render('ttt_game', {title: 'tic tac toe', grid: gb, winner: wld})
});


router.post('/adduser', function(req,res,next) {
  let username = req.body.username
  let password = req.body.password
  let email = req.body.email

  let obj = {
    username: username,
    password: password,
    email: email
  }

  let key = userController.insertUnverifiedUser(obj)
  mail()

  //TODO: 
  //send email w key
})


router.post('/verify', function(req,res) {
  let email = req.body.email
  let key = req.body.key

  let successfulVerify = userController.verifyUser(email, key)

  res.send(successfulVerify)

  //TODO: print out success message
})

router.post('/login', function(req,res) {
  let username = req.body.username
  let password = req.body.password

  if (userController.login(username, password) !== null){
    res.cookie('username', username, {maxAge: 900000}).send()
    console.log("cookie created successfully")
  }
})

router.post('/logout', function(req,res) {
    let cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.redirect('/');
})

router.get('/listgames', function(req,res,next){
  //TODO: return status: "OK", games[id, start_date]
}) 

router.get('/getgame', function(req,res,next){
  //TODO: accept {id:}
  //get the corresponding game (status, grid from top left to bottom right)
}) 

router.get('/getgame', function(req,res,next){
  //TODO: get human, wopr, tie 
})



module.exports = router;
