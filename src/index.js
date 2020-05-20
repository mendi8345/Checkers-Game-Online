const app = require('./app')
const http = require('http')
const socketio = require('socket.io')
const port = process.env.PORT
const User = require('./models/user')
const { addUser, removeUser, getUser, getUsersInRoom, getUserByUserId } = require('./socketUsers.js')
const server = http.createServer(app)
const io = socketio(server)

const findUser = async(id) => {
    const user = await User.findById(id)
    console.log(user.name)
    return user;
}
const updateRating = async(user, rating) => {
    console.log("mmmmmaaaaaaaaaaaaaaaaaaa")
    user['rating'] = rating
    console.log("inside updateRating user['rating'] = ", user.name, " ", user.rating)
    await user.save()
    return user;
}
server.listen(port, () => {
    console.log('Server is up on port ' + port)
})

io.on('connection', (socket) => {
    console.log('New WebSocket connection')
    console.log(socket.id)
    socket.on('join', async(data) => {
        const room = "players"
        const id = data.id
        const user = await findUser(id)

        if (user) {
            const player = addUser({ id: socket.id, userId: user.id, username: user.name, room: "players" })
            socket.emit("player", player)
            const users = getUsersInRoom(room)

            socket.join("players")
            console.log(users)
            io.to(room).emit('roomData', (users))
        }
        // callback()
    })

    socket.on("play-with", (socketInfo) => {
        const room = socketInfo
        const invitingPlayerId = socket.id
        const user = getUser(socketInfo)

        // console.log("server on play with  user = ", user)
        socket.join(room)
        console.log("on   play-with", socket.id)
        socket.broadcast.to(socketInfo).emit("join-game", { room, invitingPlayerId, user })
            // to(socketsInfo)
    })
    socket.on("confirm-play", (data) => {
        console.log("confirm-play", data)
        if (data.play) {
            const room = data.room
            socket.join(data.room)
            const user1 = getUser(socket.id)
            const user2 = getUser(data.socketId)
            user1.room = room
            user2.room = room
            const allPlayers = getUsersInRoom("players")
            const gamePlayers = getUsersInRoom(data.room)
                // console.log("server on confirm-play users = ", allPlayers)
            console.log("server on confirm-play gamePlayers = ", gamePlayers)
                // io.to("players").emit('roomData', (users))
            io.to("players").emit("roomData", allPlayers)
            io.to(data.room).emit("confirm-play", { gamePlayers, room })
                // io.to(data.room).clients((err, clients) => {
                //     console.log("inside  on turn turn = ", data.room) // loggs the correct room
                //     console.log("inside  on turn clients = ", clients) // loggs an empty array
                // })

        }
    })

    socket.on("play-now", (data) => {
        console.log("server play now", socket.id);
        console.log("server play now", data.thisRoom);
        socket.join(data.thisRoom)

        const player = getUserByUserId(data.userId)
        player.id = socket.id
        const gamePlayers = getUsersInRoom(data.thisRoom)
        const playerColor = gamePlayers[0] == player ? "white" : "black";
        console.log("playerColor = ", playerColor)

        console.log("on play now player= ", gamePlayers)
        socket.emit("play-now", { checkers, player, playerColor, gamePlayers })
            // io.to(data.thisRoom).clients((err, clients) => {
            //     console.log("inside  on play now room = ", data.thisRoom) // loggs the correct room
            //     console.log("inside  on play now clients = ", clients) // loggs an empty array
            // })

    })
    socket.on("unload", (data) => {
        const gamePlayers = getUsersInRoom("players")
        gamePlayers.forEach(player => {
            if (player.userId == data.userId)
                removeUser(player.id)
        });
    })

    var checkers = [
        { row: 1, cell: 2, color: 'white', isKing: false },
        { row: 1, cell: 4, color: 'white', isKing: false },
        { row: 1, cell: 6, color: 'white', isKing: false },
        { row: 1, cell: 8, color: 'white', isKing: false },
        { row: 2, cell: 1, color: 'white', isKing: false },
        { row: 2, cell: 3, color: 'white', isKing: false },
        { row: 2, cell: 5, color: 'white', isKing: false },
        { row: 2, cell: 7, color: 'white', isKing: false },
        { row: 3, cell: 2, color: 'white', isKing: false },
        { row: 3, cell: 4, color: 'white', isKing: false },
        { row: 3, cell: 6, color: 'white', isKing: false },
        { row: 3, cell: 8, color: 'white', isKing: false },
        { row: 6, cell: 1, color: 'black', isKing: false },
        { row: 6, cell: 3, color: 'black', isKing: false },
        { row: 6, cell: 5, color: 'black', isKing: false },
        { row: 6, cell: 7, color: 'black', isKing: false },
        { row: 7, cell: 2, color: 'black', isKing: false },
        { row: 7, cell: 4, color: 'black', isKing: false },
        { row: 7, cell: 6, color: 'black', isKing: false },
        { row: 7, cell: 8, color: 'black', isKing: false },
        { row: 8, cell: 1, color: 'black', isKing: false },
        { row: 8, cell: 3, color: 'black', isKing: false },
        { row: 8, cell: 5, color: 'black', isKing: false },
        { row: 8, cell: 7, color: 'black', isKing: false },
    ]




    socket.on("render-checkers", (data) => {
        // socket.join(room)

        console.log("on  render-checkers", data)
            // socket.broadcast.to(data.thisRoom).emit("render-checkers", data.checkers)
        socket.broadcast.to(data.thisRoom).emit("render-checkers", data.checkers)

        // .to(data.thisRoom)
    })

    socket.on("set-checkers", (data) => {
        // console.log("on checkers", checkers)
        socket.broadcast.to(data.thisRoom).emit("get-checkers", data.checkers)

    })

    socket.on("turn", (data) => {
        // socket.join(room)
        console.log("inside  on turn turn = ", data.turn)
        io.to(data.thisRoom).emit("turn", data.turn)
            // io.in(data.thisRoom).clients((err, clients) => {
            //         console.log("inside  on turn turn = ", data.thisRoom) // loggs the correct room
            //         console.log("inside  on turn clients = ", clients) // loggs an empty array
            //     })
            // io.to(data.thisRoom)
    })

    socket.on("start-new-game", async(data) => {

        if (!data.winner || !data.loser) {
            const user = await findUser(data.player.userId)
            await updateRating(user, user.rating - 10)
        }
        const users = getUsersInRoom(data.player.room)
        users.forEach(user => {
            removeUser(user.id)

        });
        io.to(data.thisRoom).emit("start-new-game")
        console.log("++++++++", data)
    })

    socket.on("numOfKillInThisTurn", (data) => {
        socket.broadcast.to(data.thisRoom).emit("anotherdKillForThisTurn", data.numOfKillInThisTurn)
    })

    socket.on("anotherdKillForThisTurn", (data) => {
        socket.broadcast.to(data.thisRoom).emit("anotherdKillForThisTurn", data.anotherdKillForThisTurn)
    })

    socket.on("ForcedKillOnBoard", (data) => {
        socket.broadcast.to(data.thisRoom).emit("ForcedKillOnBoard", data.isForcedKillOnBoard)

    })

    socket.on("checkerToKill", (data) => {
            socket.broadcast.to(data.thisRoom).emit("checkerToKill", data.checkerToKill)

        })
        // socket.on("check-Win", (data) => {
        //     io.to(data.room).emit("check-Win")

    // })
    socket.on("winner", async(data) => {
        const user = data.winner
        if (user) {
            const winner = await findUser(user.userId)
            await updateRating(winner, winner.rating + 10)
        }
        const users = getUsersInRoom(data.thisRoom)
        users.forEach(user => {
            removeUser(user.id)
        });
    })

    socket.on("loser", async(data) => {
        const user = data.loser
        if (user) {
            const loser = await findUser(user.userId)
            await updateRating(loser, loser.rating - 10)
        }
        const users = getUsersInRoom(data.thisRoom)
        users.forEach(user => {
            removeUser(user.id)

        });
    })
})