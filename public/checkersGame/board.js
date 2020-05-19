const socket = io()
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get("id");
const thisRoom = urlParams.get("room");
console.log(userId)

// const { userId } = Qs.parse(location.search, { ignoreQueryPrefix: true })
var player = undefined

var playerColor = undefined
var isForcedKillOnBoard = false;
var isforcedKillOnBoardNextTurn;
var anotherdKillForThisTurn = false;
var numOfKillInThisTurn = 0;
var numOfKingsMovesWithoutKill = 0;
var checkers = []
var selectedChecker = undefined;
var checkerToKill
var winner = undefined
var loser = undefined
var turn = "white";
var gameBoard = undefined;
var $myColor = document.getElementById("player-color")


var $newGame = document.getElementById("new-game")
$newGame.addEventListener('click', () => {
    const newGame = confirm("Are you sure you want to play a new game")
    if (newGame) {

        console.log("ma kore itcha")
            // player.room = "players"
        socket.emit("start-new-game", {
                player,
                thisRoom,
                winner,
                loser
            })
            // window.open("http://localhost:3000/play?id=" + player.userId, "_self")
            // play ? id = ' + user.id

    }

})


socket.emit("play-now", { userId, thisRoom })

socket.on("play-now", (data) => {
    checkers = data.checkers
    player = data.player
        // thisRoom = player.room
    playerColor = data.playerColor
    playerColor == "white" ? $myColor.classList.add("W-color") : $myColor.classList.add("B-color")

    // console.log("on play now player= ", data.player)
    console.log("on play now playerColor= ", data.playerColor)
    console.log("on play now gamePlayers= ", data.gamePlayers)
    createBoard()
})

socket.on("render-checkers", (data) => {
    console.log("checkers =", data)
    checkers = data
    renderCheckers(checkers)
})
socket.on("get-checkers", (data) => {
    console.log("checkers =", data)
    checkers = data
})
socket.on("turn", (data) => {
    console.log("server on exe turn  = ", turn)

    isThereAForcedKillOnBoard()
    isThereAWin(checkers, turn)
    var divTurn = document.getElementById(turn + "-turn")
    divTurn.classList.remove("my-turn")
    turn = data == "white" ? "black" : "white"
    console.log("server on this turn =  ", turn)
    divTurn = document.getElementById(turn + "-turn")
    divTurn.classList.add("my-turn")
})

// socket.on("check-Win", (data) => {
//     s
//     isThereAWin(checkers, turn)

// })
socket.on("numOfKillInThisTurn", (data) => {
    numOfKillInThisTurn = data

})
socket.on("start-new-game", () => {
    // player.room = "players"
    const id = player.userId
    player = null
    console.log("client           start-new-game")
    window.open("http://localhost:3000/play?id=" + id, "_self")
})

// socket.on("ForcedKillOnBoard", (data) => {
//     console.log("on ForcedKillOnBoard =", data)
//     if (!anotherdKillForThisTurn) {
//         isThereAForcedKillOnBoard()
//     }
// })

// socket.on("anotherdKillForThisTurn", (data) => {
//     console.log("on anotherdKillForThisTurn =", data)
//     checkers.forEach(checker => {
//         isThereAForcedKillForThisChecker(checker, checker.color)
//     });
// })
socket.on("checkerToKill", (data) => {
    console.log("on checkerToKill =", data)
    checkerToKill = data
})



function createBoard() {
    console.log("inside create board", checkers)
    gameBoard = document.createElement("div");
    gameBoard.id = "board";
    gameBoard.rows = [
        createRow(1),
        createRow(2),
        createRow(3),
        createRow(4),
        createRow(5),
        createRow(6),
        createRow(7),
        createRow(8)
    ];
    for (var i = 0; i < gameBoard.rows.length; i++) {

        gameBoard.insertBefore(gameBoard.rows[i], gameBoard.childNodes[i]);
    }
    console.log("inside create board", gameBoard)
    document.body.appendChild(gameBoard);
    (gameBoard.rows);
    renderCheckers(checkers);
    return gameBoard;
}

function createRow(rowNum) {
    var row = document.createElement("div");
    row.id = "row-" + rowNum;
    row.className = "row";

    row.cells = [
        createCell(rowNum, 1),
        createCell(rowNum, 2),
        createCell(rowNum, 3),
        createCell(rowNum, 4),
        createCell(rowNum, 5),
        createCell(rowNum, 6),
        createCell(rowNum, 7),
        createCell(rowNum, 8)
    ];

    for (var i = 0; i < row.cells.length; i++) {
        (row.cells[i].id);
        (row.cells[i]);
        row.insertBefore(row.cells[i], row.childNodes[i]);
    }
    (row.cells);
    return row;
}

function createCell(rowNum, cellNum) {
    var cell = document.createElement("div");
    cell.id = "cell-" + rowNum + '-' + cellNum;
    if (cellColor(rowNum, cellNum) === 'black') {
        cell.className = "cell black";
    } else {
        cell.className = "cell white";
    }
    return cell;
}

function moveSelectedCheckerHere(event) {
    if (selectedChecker) {
        console.log("inside emit checkers 88")
        event.preventDefault;
        var numOfCheckersBeforMove = checkers.length;

        var blackCell = this;
        var id = blackCell.id;
        var idParts = id.split('-');
        checkerRow = selectedChecker.row;
        checkerCell = selectedChecker.cell;
        cellRow = Number(idParts[1])
        cell = Number(idParts[2]);

        if (isALegalMove(selectedChecker, blackCell)) {
            var transferredChecker = event.dataTransfer.getData("text");
            console.log("transferredChecker = ", transferredChecker)
            this.appendChild(document.getElementById(transferredChecker));
            selectedChecker.row = cellRow;
            selectedChecker.cell = cell;

            if (checkerToKill != undefined) {
                checkers.splice(checkerToKill, 1);
                checkerToKill = undefined;
            }
            crownKing(selectedChecker.color, selectedChecker.row)

            socket.emit("set-checkers", { checkers, thisRoom })
            socket.emit("render-checkers", { checkers, thisRoom })
            if (checkerToKill)
                socket.emit("checkerToKill", { checkerToKill, thisRoom })



            renderCheckers(checkers);
            var numOfCheckersAfterMove = checkers.length;
            if (numOfCheckersAfterMove != numOfCheckersBeforMove) {
                numOfKillInThisTurn++;
                numOfKingsMovesWithoutKill = 0;
            }

            if ((numOfKillInThisTurn > 0) && (isThereAForcedKillForThisChecker(selectedChecker, selectedChecker.color))) {
                socket.emit("numOfKillInThisTurn", { numOfKillInThisTurn, thisRoom })
                socket.emit("anotherdKillForThisTurn", { anotherdKillForThisTurn, thisRoom })
            } else {
                if (selectedChecker.isKing) {
                    if (numOfCheckersAfterMove == numOfCheckersBeforMove) {
                        numOfKingsMovesWithoutKill++
                        isDraw(numOfKingsMovesWithoutKill)
                    }
                }
                numOfKillInThisTurn = 0;
                isThereAForcedKillOnBoard()
                socket.emit("ForcedKillOnBoard", { isForcedKillOnBoard, thisRoom })
                selectedChecker = undefined
                    // turn = turn == "white" ? "black" : "white"
                socket.emit("turn", {
                        turn,
                        thisRoom
                    })
                    // turn = undefined
            }
        }
    }
}

function crownKing(color, row) {
    if (color == `black` && row == 1) {
        selectedChecker.isKing = true
    } else if (color == `white` && row == 8) {
        selectedChecker.isKing = true
    }
}

function cellColor(cellNum, rowNum) {
    return parity(cellNum) == parity(rowNum) ? 'white' : 'black'
}

function parity(num) {
    return (num % 2 == 0) ? 'even' : 'odd';
}

function clearBoard(firstBoard) {
    if (!firstBoard) {

        var blackCells = document.getElementsByClassName("black cell");
        (blackCells);
        for (var index = 0; index < blackCells.length; index++) {
            var cell = blackCells[index];
            while (cell.firstChild) {
                cell.removeChild(cell.firstChild);
            }
            cell.removeEventListener("click", moveSelectedCheckerHere);
        }
    }
}

function isThereAForcedKillOnBoard() {
    if (!(anotherdKillForThisTurn)) {
        ("in function isThereAForcedKillOnBoard")
        var allCheckers = checkers;
        for (var i = 0; i < allCheckers.length; i++) {
            if (allCheckers[i].color != turn) {
                var checker = allCheckers[i];
                var color = turn == "white" ? "black" : "white";

                if (isThereAForcedKillForThisChecker(checker, color)) {
                    isForcedKillOnBoard = true;
                    // anotherdKillForThisTurn=false;
                }
            }
        }
    }

    return isForcedKillOnBoard;
}


function isThereAForcedKillForThisChecker(checker, checkerColor) {

    var emptyCell;
    anotherdKillForThisTurn = false;
    var allCheckers = checkers;
    ("checkerColor=", checkerColor)
    for (var j = 0; j < allCheckers.length; j++) {
        if (allCheckers[j].color != checkerColor) {
            var opponentChecker = allCheckers[j];

            if (checkerColor == "white" || checker.isKing || numOfKillInThisTurn > 0) {
                emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell + 2));
                if (((checker.row + 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    ("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
                emptyCell = document.getElementById("cell-" + (checker.row + 2) + "-" + (checker.cell - 2));
                if (((checker.row + 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    anotherdKillForThisTurn = true;
                }
            }

            if (checkerColor == "black" || checker.isKing || numOfKillInThisTurn > 0) {
                ("numOfKillInThisTurn>0 ==", numOfKillInThisTurn > 0)

                var emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell + 2));
                if (((checker.row - 1 == opponentChecker.row) && (checker.cell + 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    ("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
                emptyCell = document.getElementById("cell-" + (checker.row - 2) + "-" + (checker.cell - 2));
                if (((checker.row - 1 == opponentChecker.row) && (checker.cell - 1 == opponentChecker.cell)) &&
                    (emptyCell != null && emptyCell.children.length <= 0)) {
                    var checkerDiv = document.getElementById("cell-" + (checker.row) + "-" + (checker.cell)).firstChild;
                    checkerDiv.classList.add("ready-to-kill");
                    ("There is A Forced Kill on row" + checker.row + " " + checker.cell)
                    anotherdKillForThisTurn = true;
                }
            }
        }
    }

    return anotherdKillForThisTurn;

}


function isThereAWin(checkers, turn) {
    // checkIfopponentOutOfCheckers(checkers);
    checkIfOpponentCannotMove(turn)

}


// function checkIfopponentOutOfCheckers(checkers) {
//     var numOfBlackCheckers = 0;
//     var numOfWhiteCheckers = 0;
//     for (let index = 0; index < checkers.length; index++) {
//         var checker = checkers[index];

//         if (checker.color == "black") {
//             numOfBlackCheckers++;
//             (numOfBlackCheckers)
//         }
//         if (checker.color == "white") {
//             numOfWhiteCheckers++;
//             (numOfWhiteCheckers)
//         }
//     }
//     if (numOfBlackCheckers == 0) {
//         playerColor == "white" ? winner = player : loser = player

//         var message = "GAME OVER: white player won \n +10 points"
//         socket.emit("winner", { winner, thisRoom })
//         socket.emit("loser", { loser, thisRoom })
//         setTimeout(function() { alert(message) }, 30)
//             // setTimeout(function() { clearBoard(); }, 35)
//             // window.open("http://localhost:3000/play?id=" + player.userId, "_self")
//     }
//     if (numOfWhiteCheckers == 0) {
//         playerColor == "black" ? winner = player : loser = player
//         socket.emit("winner", { winner, thisRoom })
//         socket.emit("loser", { loser, thisRoom })
//         setTimeout(function() { alert("GAME OVER: BLACK PLYAR WON") }, 30)
//             // setTimeout(function() { clearBoard() }, 31)
//             // window.open("http://localhost:3000/play?id=" + player.userId, "_self")
//     }
// }

function checkIfOpponentCannotMove(turn) {
    var win = true;
    var color = turn == "white" ? "black" : "white";
    var allBlackCells = document.getElementsByClassName("cell black");
    var allOpponentCheckers = document.getElementsByClassName(color + "-checker");
    for (let index = 0; index < allOpponentCheckers.length; index++) {
        var checkerDiv = allOpponentCheckers[index];
        var i = checkerDiv.id.split("-")[1];
        var checker = checkers[i];
        ("checker =======", checker)
        for (let j = 0; j < allBlackCells.length; j++) {
            var cell = allBlackCells[j];
            if (isALegalMove(checker, cell)) {
                checkerToKill = undefined;
                win = false;
                break;
            }
        }
    }
    if (win) {
        playerColor == turn ? winner = player : loser = player

        // var message = "GAME OVER: " + turn + " PLYAR WON," + color + "Cannot Move"
        var message = "GAME OVER: " + turn + " won \n "
        socket.emit("winner", { winner, thisRoom })
        socket.emit("loser", { loser, thisRoom })
        setTimeout(function() { alert(message) }, 30)
        setTimeout(function() { clearBoard() }, 35)
        setTimeout(function() { window.open("http://localhost:3000/play?id=" + player.userId, "_self") }, 35)
            // window.open("http://localhost:3000/play?id=" + player.userId, "_self")
        return win;
    }
}

function isDraw(numOfKingsMovesWithoutKill) {
    if (numOfKingsMovesWithoutKill > 15) {

        setTimeout(function() { alert("DRAW: GAME OVER") }, 30)
        setTimeout(function() { clearBoard(); }, 35)
        socket.emit("draw")
        setTimeout(function() { window.open("http://localhost:3000/play?id=" + player.userId, "_self") }, 35)

    }
}