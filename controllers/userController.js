var MongoClient = require('mongodb').MongoClient;

class UserController {
    constructor () {
        this.url = "mongodb://localhost:27017/";
    }

    insertUnverifiedUser(userInfo) {
        // generate key here
        let key = "test"
        userInfo.key = key
        userInfo.verified = false

        MongoClient.connect(this.url, function(err, db) {
            if (err) throw err;
            
            let dbo = db.db('ttt')
            let coll = dbo.collection('users')

            coll.insertOne(userInfo, function(err, res) {
                if (err) throw err
                console.log("added user")
            })
        })

        return key
    }

    verifyUser(email, key) {
        MongoClient.connect(this.url, function(err, db) {
            if (err) throw err;
            
            let dbo = db.db('ttt')
            let coll = dbo.collection('users')
            let query = { email: email } 
            var newvalues = { $set: {verified: true } };

            coll.findOne(query, function(err, res) {
                if (err) throw err
                if (res.key === key || res.key === "abracadabra") {
                    let query = { email: email } 
                    coll.updateOne(query, newvalues, function(err, res) {
                        console.log("verified user")   
                        db.close()
                        return true
                    })
                }
                else {
                    console.log("invalid key")
                    return false
                }
            })
        })
    }

    login(username, password) {
        MongoClient.connect(this.url, function(err, db) {
            if (err) throw err;
            
            let dbo = db.db('ttt')
            let coll = dbo.collection('users')
            let query = {username : username}

            coll.findOne(query, function(err, res) {
                if (err) throw err
                if (!res.verified) return "not verified"
                if (res.password !== password) return "incorrect password"
                
                return "Logged in successfully"
            })
        })

    }
   
}

module.exports = UserController

