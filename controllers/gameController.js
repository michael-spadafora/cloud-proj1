var MongoClient = require('mongodb').MongoClient;
var mongo = require('mongodb');

const PLAYER = 'X'
const COMPUTER = 'O'

class GameController {
    constructor () {
        this.url = "mongodb://localhost:27017/";
        this.counter = 0;
    }

    async listGames(username) {
        let db = await MongoClient.connect(this.url)

        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username}

        

        let games = await coll.find(query).toArray()


        if (!games) {
            return {status: 'ERROR'}
        }

        for (let i = 0; i < games.length; i++) {
            games[i].id = games[i]._id

        }

        console.log(games)

        
        return {status: "OK", games: games}
    
    }

    async getGame(id) {
        let db = await MongoClient.connect(this.url)
            
        console.log("ID:" + id)

        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let oid = new mongo.ObjectId(id)

        let query = {_id: oid}

        let pointer = await coll.findOne(query)

        console.log(pointer)


        if (!pointer) {
            return {status: 'ERROR', message: "game not found"}
        }    

        return pointer
    }

    async getScore(username) {
        let db = MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username}

        let pointer = await coll.find(query)

        let list = pointer.toArray()

        if (!pointer) {
            return {status: "ERROR"}
        }

        //sum wins
        let human = 0
        let wopr = 0
        let tie = 0

        for (let i = 0; i < pointer.length; i++) {
            if (winner === PLAYER) {
                human++;
            }
            if (winner === COMPUTER) {
                wopr++;
            }
            else tie++
        }

        return {human: human, wopr: wopr, tie: tie}
            


    }

    async getActiveGame(username) {
        let db = await MongoClient.connect(this.url)

        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username, active: true}

        

        let activeGame = await coll.findOne(query)

        if (!activeGame) {
            this.counter = this.counter+1
            return this.counter
        }
        
        return activeGame
    }

    async updateGame(username, updated) {
        let db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username, active: true}

        let update = {$set :{
            winner: updated.winner,
            grid: updated.grid,
            active: updated.active
        }}
        let options = { upsert: true }

        let pointer = await coll.updateOne(query, update, options)
        pointer = await coll.findOne(query)

        if (!pointer) {
            return {status: 'ERROR', message: "game not found"}
        }    
        return pointer
    }
}

module.exports = GameController