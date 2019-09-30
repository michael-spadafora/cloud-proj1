var GameController = require('../controllers/gameController')

const PLAYER = 'X'
const COMPUTER = 'O'

let gameController = new GameController()

class Game {
    constructor(gameboard, username) {
        //newGame
        this.winner = ' '
        this.username = username

        if (!gameboard) {
            this.gameboard = []
            for (let i = 0; i < 9; i++) {
                this.gameboard[i] = ' '
            }
    
        }
        //continue game
        else this.gameboard = gameboard
        

    }

    async makeMove(index) {
        if (!this.isEmpty(index)) {
            return {status: "ERROR", message: "space already taken", grid: this.gameboard, winner: this.winner}
        }

        this.makePlayerMove(index)
        let winner = this.checkWinner()
        let boardFull = this.checkBoardFull()
        if (winner !== ' ' || boardFull) {
            await this.processEnd()
            return this
        }



        this.makeComputerMove(index)
        winner = this.checkWinner()
        boardFull = this.checkBoardFull()
        if (winner !== ' ' || boardFull) {
            await this.processEnd()
            return this
        }

        //TODO: update in db

        let update = {
            grid: this.gameboard,
            winner: this.winner,
            state: "ACTIVE",
            username: this.username
        }
        await gameController.updateGame(this.username, update)


        return this

        //also update in database
    }

    processEnd() {
        let update = {
            grid: this.gameboard,
            winner: this.winner,
            state: "FINISHED",
            username: this.username
        }

        gameController.updateGame(this.username, update)

    }

    makePlayerMove(index) {
        this.gameboard[index] = PLAYER
    }

    makeComputerMove() {
        let index = this.calculateComputerMove()
        this.gameboard[index] = COMPUTER
    }

    checkBoardFull() {
        for (let i = 0; i < 9; i++) {
            //if any is empty, then false
            if (this.isEmpty(i)) {
                return false
            }
        }
        return true
    }

    checkWinner() {
        var wld = ' '
        let gb = this.gameboard

        //check columns
        for (var i = 0; i < 3; i++) {
            if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="O")
            wld = 'O'
            if (gb[i]===gb[i+3] && gb[i+3]===gb[i+6] && gb[i+3]==="X")
            wld = 'X'
        }
        //check rows
        for (var i = 0; i < 9; i=i+3) {
            if (gb[i]===gb[i+1] && gb[i+1]===gb[i+2] && gb[i+1]==='O') {
                wld = 'O'
            }
            if (gb[i]===gb[i+1] && gb[i+1]===gb[i+2] && gb[i+1]==='X'){
                wld = 'X'
            }
        }
        // check diagonals
        if (gb[0]===gb[4] && gb[4]===gb[8])
            wld = gb[0]

        if (gb[2]===gb[4] && gb[4]===gb[6])
            wld = gb[0]

        this.winner = wld
        return wld
    }

    calculateComputerMove() {
        //first check the gameboard for win condition 
        
        let gb = this.gameboard

        //first check verticals
        for (let i = 0; i < 6; i++) {
            if (gb[i] === COMPUTER) {
                if (gb[i+3] === COMPUTER) {
                    if (this.isEmpty((i+6) % 9))
                        return (i+6) % 9
                }
            }
        }

        //then check horizontals (col 1 + col 2 OR col1 + col3)
        for (let i = 0; i < 9; i=i+3) {
            if (gb[i] === COMPUTER) {
                if (gb[i+1] === COMPUTER) {
                    if (this.isEmpty(i+2))                    
                        return i+2
                }
                if (gb[i+2] === COMPUTER) {
                    if (this.isEmpty(i+1))                    
                        return i+1
                }
            }
        }
        
        //then check horizontals (col2 + col3)
        for (let i = 1; i < 9; i=i+3) {
            if (gb[i] === COMPUTER) {
                if (gb[i+1] === COMPUTER) {
                    if (this.isEmpty(i-1))                    
                        return i-1
                }
            }
        }

        //Finally check diagonals
        if (gb[4] === COMPUTER) {
            if (gb[0] === COMPUTER) {
                if (this.isEmpty(8))                    
                    return 8
            }
            if (gb[8] === COMPUTER) {
                if (this.isEmpty(0))                    
                    return 0
            }

            if (gb[2] === COMPUTER) {
                if (this.isEmpty(6))                    
                    return 6
            }

            if (gb[6] === COMPUTER) {
                if (this.isEmpty(2))                    
                    return 2
            }
        }

        //now check for defense


        //first check verticals
        for (let i = 0; i < 6; i++) {
            if (gb[i] === PLAYER) {
                if (gb[i+3] === PLAYER) {
                    if (this.isEmpty((i+6) % 9))
                        return (i+6) % 9
                }
            }
        }

        //then check horizontals (col 1 + col 2 OR col1 + col3)
        for (let i = 0; i < 9; i=i+3) {
            if (gb[i] === PLAYER) {
                if (gb[i+1] === PLAYER) {
                    if (this.isEmpty(i+2))                    
                        return i+2
                }
                if (gb[i+2] === PLAYER) {
                    if (this.isEmpty(i+1))                    
                        return i+1
                }
            }
        }
        
        //then check horizontals (col2 + col3)
        for (let i = 1; i < 9; i=i+3) {
            if (gb[i] === PLAYER) {
                if (gb[i+1] === PLAYER) {
                    if (this.isEmpty(i-1))                    
                        return i-1
                }
            }
        }

        //Finally check diagonals
        if (gb[4] === PLAYER) {
            if (gb[0] === PLAYER) {
                if (this.isEmpty(8))                    
                    return 8
            }
            if (gb[8] === PLAYER) {
                if (this.isEmpty(0))                    
                    return 0
            }

            if (gb[2] === PLAYER) {
                if (this.isEmpty(6))                    
                    return 6
            }

            if (gb[6] === PLAYER) {
                if (this.isEmpty(2))                    
                    return 2
            }
        }

        //now choose in order: middle, corner, sides

        //middle
        if (this.isEmpty(4)) {
            return 4
        }

        //corners
        let corners = [0,2,6,8]

        for (let i = 0; i < corners.length; i++) {
            let corner = corners[i]
            if (this.isEmpty[corner]) 
                return corner
        }

        let sides = [1,3,5,7]

        for (let i = 0; i < sides.length; i++) {
            let side = sides[i]
            if (this.isEmpty[side]) 
                return side
        }
        
        return -1
    }

    isEmpty(index) {
        return this.gameboard[index] === ' '
    }




}

module.exports = Game