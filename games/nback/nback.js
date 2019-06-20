const numOfSquares = 9; // No of squares in grid
const highlightColor = "#f00";  // Color of the highlighted square
const showTimeoutVal = 2500; // In milliseconds
const alertBox = document.getElementById("alertBox");
const startButton = document.getElementById("startNewGame");
const stopButton = document.getElementById("stopGame");

let maxTurns = 20
let nbackValue = 1
let memoryCounter = []
let userChoices = []
let userSquareNum = 0
let userGameScore = 0
let showHighlightTimeout

let keyHandler = (e) => {
    if (e.keyCode == 89) { // for y
        console.log("User pressed y");
        e.preventDefault();
        checkUserNback();
    }
}

stopButton.disabled = true;
startButton.disabled = false;

function randomGenerator(maxNum) {
    let min = 1;
    return Math.floor(Math.random() * (+maxNum - +min)) + +min;
}

function showNewHighlight() {
    let randomNum = randomGenerator(numOfSquares)  // Generate a random number between 1 and total squares availabel
    userSquareNum = randomNum;
    console.log("Square number highlighted is ", randomNum);
    highlightSquare(randomNum);

    showHighlightTimeout = setTimeout(() => {
        removeHighlightSquare(randomNum);
        maxTurns--;
        if (maxTurns) {
            showNewHighlight();
            memoryCounter.push(randomNum); // Add the number to the memory counter
        }
        else{
            stopGame();
        }
    }, showTimeoutVal);
}

function checkUserNback() {
    console.log(memoryCounter);
    let prevNbackValue = memoryCounter[memoryCounter.length - nbackValue]
    if (userSquareNum === prevNbackValue) {
        // userChoices.push(userSquareNum); // Add the correct selected number to a separate array
        console.log("User got it right!");
        userGameScore++;
        successHighlight(userSquareNum)
        alertBox.innerHTML += ` <p> Awesome! You got that right. Score: ${userGameScore}. </p>`
    }
    else {
        failHighlight(userSquareNum)
        console.log(`Wrong! Your choice: ${userSquareNum}, Previous nback value: ${prevNbackValue} `)
    }
}

function highlightSquare(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.add("highlighted");
}

function successHighlight(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.add("success");
}

function failHighlight(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.add("fail");
}

function removeHighlightSquare(squareNumber) {
    if(squareNumber){
        let element = document.getElementById(`cell-${squareNumber}`);
        element.classList.remove("highlighted", "success", "fail");
    }
    else{
        let element = document.getElementById(`cell-${userSquareNum}`);
        element.classList.remove("highlighted", "success", "fail");
    }
}


function startNewGame() {
    startButton.disabled = true;
    stopButton.disabled = false;

    userGameScore = 0;
    maxTurns = 20;
    memoryCounter = [];
    alertBox.innerHTML = `<p> Starting the game with N = ${nbackValue}. </p> 
    (Press 'Y' for when you see the same box highlighted)`
    console.log(`Starting with nback=${nbackValue}`)
    showNewHighlight();
    userKeyEntry(); // Start listening for user keypresses
}

function stopGame(){
    clearTimeout(showHighlightTimeout);
    removeHighlightSquare()

    alertBox.innerHTML += "<h3> GAME OVER </h3>" + `Your final Score: ${userGameScore}`;
    console.log(`Game Over. User Score is ${userGameScore}`);

    startButton.disabled = false;
    stopButton.disabled = true;
    window.removeEventListener("keydown", keyHandler, true);
}


function userKeyEntry() {
    console.log("Listening for keypress");
    window.addEventListener('keydown', keyHandler, false)
}

function setNbackValue(){
    let nbackSelect = document.getElementById("nbackSelect")
    nbackValue = nbackSelect.options[nbackSelect.selectedIndex].value;
    console.log(`nback value changed to ${nbackValue}`)
}

// startNewGame();


function initialize(){
    alertBox.innerHTML += "<h3> CHOOSE 'N' AND START PLAYING </h3>" + `Instructions: <br> Press the 'Y' (yes) key when the box currently highlighted is what you saw 'N' rounds ago. `;
}

initialize()