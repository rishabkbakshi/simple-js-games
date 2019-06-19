const numOfSquares = 9; // No of squares in grid
const highlightColor = "#f00";  // Color of the highlighted square
const showHighlightTimeout = 2000;  // In milliseconds
const newHighlightTimeout = 2500; // In milliseconds
const nbackValue = 2;

let maxTurns = 20;
let memoryCounter = [];
let userChoices = [];
let userSquareNum = 0;
let userGameScore = 0;

function randomGenerator(maxNum) {
    let min = 1;
    return Math.floor(Math.random() * (+maxNum - +min)) + +min;
}

function showNewHighlight() {
    let randomNum = randomGenerator(numOfSquares)  // Generate a random number between 1 and total squares availabel
    userSquareNum = randomNum;
    console.log("Square number highlighted is ", randomNum);
    highlightSquare(randomNum);

    setTimeout(() => {
        removeHighlightSquare(randomNum);
        maxTurns--;
        if (maxTurns) {
            showNewHighlight();
            memoryCounter.push(randomNum); // Add the number to the memory counter
        }
        else{
            console.log(`Game Over. User Score is ${userGameScore}`);
        }
    }, newHighlightTimeout);
}

function checkUserNback() {
    console.log(memoryCounter);
    let prevNbackValue = memoryCounter[memoryCounter.length - nbackValue]
    if (userSquareNum === prevNbackValue) {
        // userChoices.push(userSquareNum); // Add the correct selected number to a separate array
        console.log("User got it right!");
        userGameScore++;
    }
    else {
        console.log(`Wrong! Your choice: ${userSquareNum}, Previous nback value: ${prevNbackValue} `)
    }
}

function highlightSquare(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.add("highlighted");
}

function removeHighlightSquare(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.remove("highlighted");
}


function startNewGame() {
    userGameScore = 0;
    maxTurns = 20;
    memoryCounter = [];
    showNewHighlight();
    userKeyEntry(); // Start listening for user keypresses
}


function userKeyEntry() {
    console.log("Listening for keypress");
    window.addEventListener('keydown', (e) => {
        if (e.keyCode == 89) { // for y
            console.log("User pressed y");
            checkUserNback();
            return false;
        }
    })
}

startNewGame();