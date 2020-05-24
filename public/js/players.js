const socket = io()
const socketUser = null
console.log(Qs)
const { id } = Qs.parse(location.search, { ignoreQueryPrefix: true })


var player = undefined
var $list = document.getElementById("list")

const playersTemplate = document.querySelector('#list-of-players').innerHTML
const li = document.getElementsByTagName("li")


socket.emit('join', { id })

const selectPlayer = (li) => {
    for (let index = 0; index < li.length; index++) {
        const element = li[index]
        element.addEventListener("click", () => {
            console.log(element.id)
            socket.emit("play-with", element.id)
        })
    }
}

socket.on('player', (data) => {
    player = data
    console.log("you = ", player)
})

socket.on('roomData', (data) => {
        const userId = player.userId
        console.log("userId = ",
            userId)
        console.log("data = ", data)
        const users = data.filter(user => user.userId !== userId);
        const msg = users.length > 0 ? "Please select a player to play with" : "no player as joind yet"
        $list.innerHTML = msg
        const html = Mustache.render(playersTemplate, {
            users
        })
        document.querySelector('#players').innerHTML = html

        selectPlayer(li)
    })
    //


socket.on('join-game', (data) => {
    console.log(data, "x`5555")
    user = data.user
    console.log("client on join game user = ", user)
    var isConfirmPlay = confirm("play with " + user.username)
    if (isConfirmPlay) {
        // window.open("http://localhost:3000/checkersGame/checkers.html", "_self")
        socket.emit("confirm-play", {
            isConfirmPlay,
            player,
            socketId: data.invitingPlayerId,
            room: data.room

        })
    }


    // window.open("http://localhost:3000/checkersGame/checkers.html")
    // document.querySelector('#sidebar').innerHTML = html
})


socket.on('confirm-play', (data) => {
    // room = room.trim().toLowerCase()
    const user = data.gamePlayers.find((user) => user.id === socket.id)

    window.open(window.location.origin + "/checkersGame/checkers.html?id=" + user.userId + "&room=" + data.room, "_self")
    socket.emit("game-room", data.room)
})

// window.onbeforeunload = function() {
//     alert("window.onbeforeunload")
//     confirm("window.onbeforeunload")

//     socket.emit("unload", this.player)
// };

// window.onhashchange = function() {
//     window.confirm("window.onbeforeunload")
//     window.alert("window.onbeforeunload")
//     socket.emit("unload", this.player)
// };

window.onhashchange = function() {
    if (window.innerDocClick) {
        //Your own in-page mechanism triggered the hash change
    } else {
        window.confirm("window.onbeforeunload")
            //Browser back button was clicked
    }
}


// $messageForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     $messageFormButton.setAttribute('disabled', 'disabled')

//     const message = e.target.elements.message.value

//     socket.emit('sendMessage', message, (error) => {
//         $messageFormButton.removeAttribute('disabled')
//         $messageFormInput.value = ''
//         $messageFormInput.focus()

//         if (error) {
//             return console.log(error)
//         }

//         console.log('Message delivered!')
//     })
// })

// $sendLocationButton.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('Geolocation is not supported by your browser.')
//     }

//     $sendLocationButton.setAttribute('disabled', 'disabled')

//     navigator.geolocation.getCurrentPosition((position) => {
//         socket.emit('sendLocation', {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//         }, () => {
//             $sendLocationButton.removeAttribute('disabled')
//             console.log('Location shared!')
//         })
//     })
// })      }, () => {
//             $sendLocationButton.removeAttribute('disabled')
//             console.log('Location shared!')
//         })
//     })
// })  })
// })