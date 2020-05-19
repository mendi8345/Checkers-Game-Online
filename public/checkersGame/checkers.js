var checkerToKill = undefined;
var isFirstBoardSet = true;

// function renderCheckers() {
function renderCheckers(checkers) {
    console.log("TURN === ", turn)
    clearBoard(isFirstBoardSet);
    for (var i = 0; i < checkers.length; i++) {
        var checker = checkers[i];
        var cell = document.getElementById("cell-" + checker.row + '-' + checker.cell);
        cell.appendChild(renderChecker(i, checker.color));
    }
    if (!numOfKillInThisTurn > 0) {
        // socket.emit("check-Win", player)
        // isThereAWin(checkers, turn)
        isFirstBoardSet = false;
    }

}


function renderChecker(i, color, turn) {
    var checker = document.createElement("div");
    checker.id = "checker-" + i;
    checker.className = "checker " + color + "-checker";
    checker.checerPosition = i;
    turn == color ? checker.draggable = "true" : checker.draggable = "false";
    var crownImg = document.createElement("i");


    if (checkers[i].isKing) {
        crownImg.className = "fas fa-crown";
        checker.appendChild(crownImg);
    }
    isforcedKillOnBoardNextTurn = isForcedKillOnBoard;
    checker.addEventListener("dragstart", selectChecker);
    checker.addEventListener("drag", selectChecker);
    checker.addEventListener("click", selectChecker);

    // console.log("addEventListener to ", checker)
    isForcedKillOnBoard = false;
    return checker;
}



function selectChecker(event) {
    console.log(event)
    if (playerColor == turn) {
        console.log("inside if 1    isforcedKillOnBoardNextTurn = ", isforcedKillOnBoardNextTurn)
        event.preventDefault
        priviosSelectedChecker = document.getElementsByClassName("selected")[0];
        if (priviosSelectedChecker != undefined && (!(anotherdKillForThisTurn))) {
            priviosSelectedChecker.classList.remove("selected");
        }
        var checkerIndex = this.checerPosition;
        if (checkers[checkerIndex].color == turn && this.classList.contains("ready-to-kill")) {
            selectedChecker = checkers[checkerIndex];
            socket.emit("selected-checker", selectedChecker)
            this.classList.add("selected");
            console.log("inside if 2")


            event.dataTransfer.setData("text", event.target.id);
            madeCellResponsive();
        } else if ((!isforcedKillOnBoardNextTurn || anotherdKillForThisTurn) && (checkers[checkerIndex].color == turn)) {
            selectedChecker = checkers[checkerIndex];
            console.log("inside if 3")
                // socket.emit("selected-checker", selectedChecker)
            this.classList.add("selected");
            event.dataTransfer.setData("text", event.target.id);
            madeCellResponsive();

        }
    } else {
        console.log("invalid move ", turn, " turn")
    }
}


function isALegalMove(checker, blackCell) {
    var isLegalMove = false;
    var id = blackCell.id;
    var idParts = id.split('-')
    checkerRow = checker.row;
    checkerCell = checker.cell;

    cellRow = Number(idParts[1])
    cellColumn = Number(idParts[2])

    if (blackCell.children.length <= 0) {

        if (checker.color == "black" || checker.isKing || numOfKillInThisTurn > 0) {
            if ((((checker.color == "black" || checker.isKing) && (!numOfKillInThisTurn > 0))) && ((!(isForcedKillOnBoard)) && (cellRow == checkerRow - 1) && (cellColumn == checkerCell + 1 || cellColumn == checkerCell - 1))) {
                isLegalMove = true;
            }
            if ((cellRow == checkerRow - 2) && (cellColumn == checkerCell + 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row - 1) + "-" + (checker.cell + 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("black-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row - 1 && c.cell == checker.cell + 1 && c.color != checker.color) {
                            checkerToKill

                                = index;
                            isLegalMove = true;

                            break;
                        }
                    }
                }
            }
            if ((cellRow == checkerRow - 2) && (cellColumn == checkerCell - 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row - 1) + "-" + (checker.cell - 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("black-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row - 1 && c.cell == checker.cell - 1 && c.color != checker.color) {
                            checkerToKill

                                = index;
                            isLegalMove = true;
                            break;
                        }
                    }
                }
            }
        }

        if (checker.color == "white" || checker.isKing || numOfKillInThisTurn > 0) {

            if (((checker.color == "white" || checker.isKing) && (!numOfKillInThisTurn > 0)) && ((!(isForcedKillOnBoard)) && (cellRow == checkerRow + 1) && (cellColumn == checkerCell + 1 || cellColumn == checkerCell - 1))) {

                isLegalMove = true;
            }
            if ((cellRow == checkerRow + 2) && (cellColumn == checkerCell + 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row + 1) + "-" + (checker.cell + 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("white-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row + 1 && c.cell == checker.cell + 1 && c.color != checker.color) {
                            checkerToKill

                                = index;
                            isLegalMove = true;
                            break;
                        }
                    }
                }

            }
            if ((cellRow == checkerRow + 2) && (cellColumn == checkerCell - 2)) {
                var skipCell = document.getElementById("cell-" + (checker.row + 1) + "-" + (checker.cell - 1));
                if (skipCell.children.length > 0 && !(skipCell.classList.contains("white-checker"))) {
                    for (var index = 0; index < checkers.length; index++) {
                        var c = checkers[index];
                        if (c.row == checker.row + 1 && c.cell == checker.cell - 1 && c.color != checker.color) {
                            checkerToKill = index;
                            isLegalMove = true;
                            break;
                        }
                    }

                }

            }
        }
    }


    return isLegalMove;
}


function madeCellResponsive() {
    var blackCells = document.getElementsByClassName("cell black");

    for (var i = 0; i < blackCells.length; i++) {
        var cell = blackCells[i];
        if (cell.children.length <= 0) {
            var allCheckersDivs = document.getElementsByClassName("selected")
            if (allCheckersDivs.length > 0) {
                cell.addEventListener("dragover", allowDrop);
                cell.addEventListener("drop", moveSelectedCheckerHere);

            }
        }
    }
}

function allowDrop(event) {
    event.preventDefault();

}