const jwt = require('jsonwebtoken')
const User = require('../models/user')
const app = require('../app.js')



// const auth = async(req, res, next) => {
//     console.log("token =  = ", token)
//     try {
//         if (!token) return res.status(401).send("Access denied. No token provided.");



//         const decoded = jwt.verify(token, process.env.JWT_SECRET)
//         const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
//         if (!user) {
//             console.log("error > > > ")
//             throw new Error()
//         }
//         req.user = user
//         next()
//     } catch (e) {
//         console.log(e)
//         res.status(401).send({ error: 'Please authenticate.' })

//     }
// }

// const auth = async(token, req, res, next) => {
//     console.log("token =  = ", token)
//     try {
//         console.log("token =  = ", token)
//             //get the token from the header if present
//             // const token = req.headers["x-access-token"] || req.headers["authorization"];
//             //if no token found, return response (without going to the next middelware)
//         if (!token) return res.status(401).send("Access denied. No token provided.");

//         const accessToken = token.replace('Bearer ', '')

//         // const decoded = jwt.verify(accessToken, process.env.JWT_SECRET)
//         // const user = await User.findOne({ _id: decoded._id, 'tokens.token': accessToken })
//         if (!user) {
//             throw new Error()
//         }
//         next()
//     } catch (e) {
//         console.log(e)
//         res.status(401).send({ error: 'Please authenticate.' })

//     }
// }

// module.exports = auth