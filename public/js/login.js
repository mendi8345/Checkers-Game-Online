// // const express = require('express')
// // const User = require('../../src/models/user')
// // const auth = require('../../src/middleware/auth')
// // const sharp = require('sharp')




// const loginForm = document.getElementById("login-form");
// const loginButton = document.getElementById("login-form-submit");
// const loginErrorMsg = document.getElementById("login-error-msg");

// // router.post('/users/login', async(req, res) => {
// //     try {
// //         const user = await User.findByCredentials(req.body.email, req.body.password)
// //         const token = await user.generateAuthToken()
// //         res.send({ user, token })
// //     } catch (e) {
// //         res.status(400).send()
// //     }
// // })

// loginButton.addEventListener("click", async(e) => {
//     e.preventDefault();
//     const email = loginForm.email.value;
//     const password = loginForm.password.value;
//     // const user = await User.findByCredentials(email, password)
//     console.log('user from login = ', user)
//     if (user) {
//         const token = await user.generateAuthToken()
//         alert("You have successfully logged in.");
//         // location.reload();
//         return user
//     } else {
//         loginErrorMsg.style.opacity = 1;
//     }

// })
// module.exports(user)