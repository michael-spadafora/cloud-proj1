var express = require('express');
var UserController = require('../controllers/userController')
var mail = require('../controllers/mailController')
var GameController = require('../controllers/gameController')
var Game = require('../objects/game')

var MongoClient = require('mongodb').MongoClient
var router = express.Router();


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



var userController = new UserController();
var gameController = new GameController();


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
router.post('/ttt/play', async function(req,res,next) {
  let move = req.body.move

  if (!req.cookies.username) {
    res.send({status: "ERROR"})
  }

   //get active game
  let activeGame = await gameController.getActiveGame(req.cookies.username)

  if (move === null) {
    res.send(activeGame)
  }


  let currGame
  if (!activeGame) {
    currGame = new Game(null, req.cookies.username)

  }
  else {
    currGame = new Game(activeGame.grid, req.cookies.username)
  }


  let game = await currGame.makeMove(move)
  game.grid = game.gameboard
  console.log(game)

  res.send(game)
});


router.post('/adduser', async function(req,res,next) {
  let username = req.body.username
  let password = req.body.password
  let email = req.body.email

  let obj = {
    username: username,
    password: password,
    email: email
  }

  let key = await userController.insertUnverifiedUser(obj)
  if (!key) {
    let re = {status: "ERROR", message: "username already in use"}
    res.send(re)
  }
  else {
    try {
     await mail(email, key)
     let re = {status: "OK", message: "please check your email"}

      res.send(re)

    }
    catch(ex) {
      console.log(ex)
    }

    //e-mail
  }

  //TODO: 
  //send email w key
})


router.post('/verify', async function(req,res) {
  let email = req.body.email
  let key = req.body.key

  console.log(req.body)

  console.log(req.body.key)

  let verifyMessage = await userController.verifyUser(email, key)

  console.log(verifyMessage)

  res.send(verifyMessage)

  //TODO: print out success message
})

router.post('/login', async function(req,res) {
  let username = req.body.username
  let password = req.body.password
  
  let response = await userController.login(username, password)
  console.log(response)
  if (response.status === 'OK'){
    res.cookie('username', username, {maxAge: 900000}).send(response)
    console.log("cookie created successfully")
  }

  else res.send(response)
})

router.post('/logout', function(req,res) {
    let cookie = req.cookies;
    for (var prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }    
        res.cookie(prop, '', {expires: new Date(0)});
    }
    res.send({status: "OK"});
})

router.post('/listgames', async function(req,res,next){
  //TODO: return status: "OK", games[id, start_date]
  //Check for cookie. if no cookie then res error 
  let username = req.cookies.username
  let re = await gameController.listGames(username)
  res.send(re)
}) 

router.post('/getgame', async function(req,res,next){
  let id = req.body.id
  let game = await gameController.getGame(id)

  console.log(game)
  //if game is null? empty? return status ERROR

  game.status = "OK"
  res.send(game)
  
  //TODO: accept {id:}
  //get the corresponding game (status, grid from top left to bottom right)
}) 

router.post('/getscore', async function(req,res,next){
  //TODO: get human, wopr, tie 
  let username = req.cookies.username
  if (! username){
    res.send({status: "ERROR"})
    
  }


  let score = await gameController.getScore(username)

  score.status = "OK"

  console.log(score)

  res.send(score)

})



module.exports = router;
