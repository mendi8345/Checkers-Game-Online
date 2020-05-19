const socket = io()
const socketUser = null
console.log(Qs)
const { id } = Qs.parse(location.search, { ignoreQueryPrefix: true })
console.log("lamaaaaaaaaaaaaa", id)
socket.emit('join', { id })
var player = undefined

const playersTemplate = document.querySelector('#list-of-players').innerHTML
const li = document.getElementsByTagName("li")


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
    const id = player.id
    console.log(id)
    const users = data.filter(user => user.id !== id);
    const html = Mustache.render(playersTemplate, {
        users
    })
    document.querySelector('#players').innerHTML = html
        // alert("in room data")
    selectPlayer(li)
})


socket.on('join-game', (data) => {
    console.log(data, "x`5555")
    user = data.user
    console.log("client on join game user = ", user)
    var play = confirm("play with " + user.username)
    if (play) {
        // window.open("http://localhost:3000/checkersGame/checkers.html", "_self")
        socket.emit("confirm-play", {
            play,
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