const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
const User = require('../models/user')
const { addUser, removeUser, getUser, getUsersInRoom } = require('../socketUsers.js')

// const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

var redirectTo = null
var token = null;
var user = null;
const { sendWelcomeEmail, sendGoodByEmail } = require('../emails/account.js');

const router = new express.Router()
router.post('/signup', async(req, res) => {
    console.log(req.body)
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        token = await user.generateAuthToken()
            // res.redirect('/users/me')
        res.status(200).redirect('/play?id=' + user.id)

        // token = res.header('Authorization', 'Bearer ' + authToken);

        // res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)

    }
})

router.get('/login', async(req, res) => {
    console.log('login')
    res.sendFile(path.join(__dirname, '../../public/html/signup.html'))
})

router.get('/play', async(req, res) => {
    console.log('play')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded.id= ", decoded.id)
    const user = await User.findById(decoded.id)
        // addUser({ id: undefined, userId: user.id, username: user.name, room: "players" })
    res.sendFile(path.join(__dirname, '../../public/html/players.html'))
})

router.post('/login', async(req, res) => {
    try {
        console.log('login post ')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.status(400).send("no user with this Credentials")
        }
        token = await user.generateAuthToken();
        if (!token) {
            return res.status(400).send("no token provided")
        }
        res.status(200).redirect('/play?id=' + user.id)
        if (redirectTo)
            res.redirect(redirectTo)
            // res.status(200).redirect('/users/me/')

    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})

router.get('/users/me', async(req, res) => {
    // const user = auth(token)

    console.log("in get profile")
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
        redirectTo = '/users/me'
        res.redirect('/login')
    }
    console.log(user, ";;;;;;;;")
    res.status(200).send(user)
})

// router.post('/users/logout', async(req, res) => {
//     try {
//         req.user.tokens = req.user.tokens.filter((token) => {
//             return token.token !== req.token
//         })
//         await req.user.save()

//         res.send()
//     } catch (e) {
//         res.status(500).send()
//     }
// })



module.exports = router