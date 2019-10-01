var MongoClient = require('mongodb').MongoClient;

class UserController {
    constructor () {
        this.url = "mongodb://localhost:27017/";
    }

    async insertUnverifiedUser(userInfo) {
        // generate key here
        let key = "test"
        userInfo.key = key
        userInfo.verified = false

        let db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('users')

        //check if username already in use
        let query = {username: userInfo.username}
        let exists = await coll.findOne(query)

        if (exists) {
            return null
        }

        await coll.insertOne(userInfo)
        console.log("added user")

        return key
    }

    async verifyUser(email, key) {
        let db = await MongoClient.connect(this.url)

        
        let dbo = db.db('ttt')
        let coll = dbo.collection('users')
        let query = { email: email } 
        var newvalues = { $set: {verified: true } };

        let pointer = await coll.findOne(query)

        console.log("pointer: " + pointer)

        
        if (!pointer.key) {
            return {status: "ERROR", message: "user not found"}

        }
        
        console.log("Key: " + pointer.key)

        if (pointer.key === key || key === "abracadabra") {
            let query = { email: email } 
            await coll.updateOne(query, newvalues)
            console.log("verified user")   
            db.close()
            return {status: "OK"}
            
        }
        else {
            console.log("invalid key")
            return {status: "ERROR", message: "invalid key"}
        }
        
    }

    async login(username, password) {
        var re = ""
        let db
        db = await MongoClient.connect(this.url)
            
        let dbo = db.db('ttt')
        let coll = dbo.collection('users')
        let query = {username : username}

        let pointer = await coll.findOne(query)

        if (!pointer) {
            return {status: "ERROR", message: "incorrect password" }
        }


        if (!pointer.verified) return {status: "ERROR", message: "unverified user"}
            else if (pointer.password !== password) {
                return {status: "ERROR", message: "incorrect password" }
            }
            else return {status: "OK", message: "Logged in successfully"}
                
    }
   
}

module.exports = UserController

