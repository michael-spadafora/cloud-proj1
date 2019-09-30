var MongoClient = require('mongodb').MongoClient;

class GameController {
    constructor () {
        this.url = "mongodb://localhost:27017/";
    }

    async listGames(username) {
        let db = await MongoClient.connect(this.url)

        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username}

        

        let items = await coll.find(query).toArray()

        if (!items) {
            return {status: 'ERROR'}
        }
        
        return {status: "OK", games: items}
    
    }

    async getGame(id) {
        let db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {id: id}

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

        let query = {username: username, status: "ACTIVE"}

        

        let activeGame = await coll.findOne(query)

        if (!activeGame) {
            return null
        }
        
        return activeGame
    }

    async updateGame(username, updated) {
        let db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('games')

        let query = {username: username, status: "ACTIVE"}

        let update = {$set :{
            winner: updated.winner,
            grid: updated.grid
        }}
        let options = { upsert: true}

        let pointer = await coll.updateOne(query, update, options)

        if (!pointer) {
            return {status: 'ERROR', message: "game not found"}
        }    
        return pointer
    }
}

module.exports = GameController