const express = require('express')
const path = require('path')
var mustacheExpress = require('mustache-express')

require('./db/mongoose')
const auth = require('./middleware/auth')
const bodyParser = require('body-parser');
const userRouter = require('./routers/user')
    // const loginRouter = require('./login/login')

const app = express()

// app.engine('html', mustacheExpress());

// app.set('view engine', 'html');
// app.set('views', __dirname + '/../public/html');
app.engine('mustache', mustacheExpress());

app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, '/../public/views'))

const publicDirectoryPath = path.join(__dirname, '/../public')
    // app.use('*/images', express.static('public/img'));
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json())
    // app.use('/auth', auth);
app.use(userRouter)

// app.use(function(req, res) {
//     res.status(400).render('error');
// });
module.exports = app