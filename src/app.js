const express = require('express')
const path = require('path')

require('./db/mongoose')
const auth = require('./middleware/auth')
const bodyParser = require('body-parser');
const userRouter = require('./routers/user')
    // const loginRouter = require('./login/login')

const app = express()



const publicDirectoryPath = path.join(__dirname, '/../public/html/signup.html')
    // app.use('*/images', express.static('public/img'));
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
    // app.use('/auth', auth);
app.use(userRouter)

module.exports = app