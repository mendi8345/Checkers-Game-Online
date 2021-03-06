const users = []

const addUser = ({ id, userId, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()

    // Validate the data
    if (!username) {
        return {
            error: 'Username is required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.userId === userId
    })

    // Validate username
    if (existingUser) {
        removeUser(existingUser.id)
            // return {
            //     error: 'User is in use!'
            // }
    }

    // Store user
    const user = { id, userId, username, room }
    users.push(user)
    return user

}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}
const getUserByUserId = (userId) => {
    return users.find((user) => user.userId === userId)
}

const getUsersInRoom = (room) => {
    // room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
    getUserByUserId
}