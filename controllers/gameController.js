var MongoClient = require('mongodb').MongoClient;

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

        console.log(games)

        if (!games) {
            return {status: 'ERROR'}
        }

        games.forEach(function(game){
            game.id = game._id
        })
        
        return {status: "OK", games: games}
    
    }

    async getGame(id) {
        let db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {_id: id}

        let pointer = await coll.findOne(query)
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

        let pointer = coll.find(query)

        if (!pointer) {
            return {status: "ERROR"}
        }

        return pointer
            


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