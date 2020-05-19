const loginLink = document.getElementById("login-link");
const signupLink = document.getElementById("signup-link");
const newGame = document.getElementById("new-game");
console.log(loginLink)
loginLink.addEventListener("click", (e) => {
        window.open("http://localhost:3000/login");
    })
    // signupLink.addEventListener("click", (e) => {
    //     window.open("http://localhost:3000/users/login");
    // })

newGame.addEventListener("click", (e) => {
    window.open("http://localhost:3000/html/play-now.html");
})