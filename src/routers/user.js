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

router.get('/', async(req, res) => {
    console.log('login')
    res.sendFile(path.join(__dirname, '../../public/html/signup.html'))
})

router.post('/signup', async(req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        token = await user.generateAuthToken()
        res.status(200).redirect('/play?id=' + user.id)
    } catch (e) {
        console.log(e)
        return res.redirect('/')

    }
})


router.post('/login', async(req, res) => {
    try {
        console.log('login post ')
        const user = await User.findByCredentials(req.body.email, req.body.password)
        if (!user) {
            return res.redirect('/')
        }
        token = await user.generateAuthToken();
        if (!token) {
            return res.redirect('/')
                // return res.status(400).send("no token provided")
        }
        // res.status(200).redirect('/play?id=' + user.id)
        res.status(200).redirect('/home?id=' + user.id)

        // res.status(200).redirect('/users/me')
        if (redirectTo)
            res.redirect(redirectTo)
            // res.status(200).redirect('/users/me/')
            // res.sendFile(path.join(__dirname, '../../public/html/index.html?id=' + user.id))

    } catch (e) {
        console.log(e)
            // alert("invalid email or password")
        return res.redirect('/')

        // res.status(400).send()
    }
})

router.get('/play', async(req, res) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded.id= ", decoded.id)
    const user = await User.findById(decoded.id)
    res.sendFile(path.join(__dirname, '../../public/html/players.html'))
})
router.get('/home', async(req, res) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log("decoded.id= ", decoded.id)
    const user = await User.findById(decoded.id)
    res.sendFile(path.join(__dirname, '../../public/html/home.html'))
})





router.get('/profile', async(req, res) => {
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(req.query.id)
    if (!user) {
        redirectTo = '/profile'
    }
    console.log(user, ";;;;;;;;")
    res.render('profile', {
            name: user.name,
            email: user.email,
            rating: user.rating,
            numOfGames: user.numOfGames,
            numOfWins: user.numOfGames,
            numOfLosses: user.numOfLosses,
        })
        // res.status(200).send(user)
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