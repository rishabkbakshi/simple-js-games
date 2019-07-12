const maxNum = 9; // No of squares in grid
const highlightColor = "#f00";  // Color of the highlighted square
const showTimeoutVal = 2500; // In milliseconds
const alertBox = document.getElementById("alertBox");
const startButton = document.getElementById("startNewGame");
const stopButton = document.getElementById("stopGame");
const numberDisplay = document.getElementById("numberDisplay");

let maxRounds = 20
let currentRound = 0
let nbackValue = 2
let memoryCounter = []
let userChoices = []
let userSelectNum = 0
let userGameScore = 0
let showHighlightTimeout
let repeatPoints = [];


let maxRepeatPoints = 4;
// const maxRepeatPoints = Math.floor(maxRounds/nbackValue);


// let keyHandler = (e) => {
//     if (e.keyCode == 89) { // for y
//         console.log("User pressed y for", userSelectNum);
//         e.preventDefault();
//         checkUserNback();
//     }
// }

stopButton.disabled = true;
startButton.disabled = false;

// Generate a number between 1 and 9
function randomGenerator(minNum, maxNum) {
    return Math.floor(Math.random() * (+maxNum - +minNum)) + +minNum;
}

// Generate repeat points
function listRepeatPoints() {
    for (let i = 0; i < maxRepeatPoints; i++) {
        let randomNum = randomGenerator(nbackValue, maxRounds);
        if (repeatPoints.includes(randomNum)) {
            console.log(repeatPoints, `${randomNum} already available, recalculating`);
            maxRepeatPoints++;
            // try again with a new number to avoid duplicate place values
        }

        else {
            repeatPoints.push(randomNum);
        }
    }
    console.log(maxRepeatPoints, repeatPoints);
}



function showNewHighlight() {
    removeHighlight();
    let randomNum = randomGenerator(1, maxNum)  // Generate a random number between 1 and maxNum
    if (repeatPoints.includes(currentRound)) {
        userSelectNum = memoryCounter[currentRound - nbackValue]
        console.log("repeating now", currentRound, memoryCounter, userSelectNum)
    }
    else {
        userSelectNum = randomNum;
        console.log("not repeating", currentRound, memoryCounter, userSelectNum)
    }
    numberDisplay.innerHTML = userSelectNum;
    // console.log("Square number highlighted is ", randomNum);
    // highlightSquare(randomNum);


    showHighlightTimeout = setTimeout(() => {
        // removeHighlight(randomNum);
        maxRounds--;
        currentRound++;
        if (maxRounds) {
            memoryCounter.push(userSelectNum); // Add the number to the memory counter
            showNewHighlight();
        }
        else {
            stopGame();
        }
    }, showTimeoutVal);
}

function checkUserNback() {
    console.log(memoryCounter);
    let prevNbackValue = memoryCounter[memoryCounter.length - nbackValue]
    if (userSelectNum === prevNbackValue) {
        // userChoices.push(userSelectNum); // Add the correct selected number to a separate array
        console.log("User got it right!");
        userGameScore++;
        successHighlight(userSelectNum)
        alertBox.innerHTML += ` <p> Awesome! You got that right. Score: ${userGameScore}. </p>`
    }
    else {
        failHighlight(userSelectNum)
        console.log(`Wrong! Your choice: ${userSelectNum}, Previous nback value: ${prevNbackValue} `)
    }
}

function highlightSquare(squareNumber) {
    let element = document.getElementById(`cell-${squareNumber}`);
    element.classList.add("highlighted");
}

function successHighlight() {
    numberDisplay.classList.add("success");
}

function failHighlight() {
    numberDisplay.classList.add("fail");
}

function removeHighlight() {
    numberDisplay.classList.remove("highlighted", "success", "fail");
}


function startNewGame() {
    startButton.disabled = true;
    stopButton.disabled = false;
    repeatPoints = [];

    listRepeatPoints()

    userGameScore = 0;
    maxRounds = 20;
    memoryCounter = [];
    alertBox.innerHTML = `<p> Starting the game with N = ${nbackValue}. </p> 
    (Press 'Y' for when you see the same box highlighted)`
    console.log(`Starting with nback=${nbackValue}`)
    showNewHighlight();
    userKeyEntry(); // Start listening for user keypresses
}

function stopGame() {
    clearTimeout(showHighlightTimeout);
    memoryCounter.push(userSelectNum);
    removeHighlight()

    alertBox.innerHTML += "<h3> GAME OVER </h3>" + `<p> Your final Score: ${userGameScore} </p>`;

    var html = 'Number Series: [';
    for (var i = 0; i < memoryCounter.length; i++) {
        if(i==0){
            html += ` ${memoryCounter[i]}`;
        }
        html += `, ${memoryCounter[i]}`;
    } 
    alertBox.innerHTML += html + ' ]';

    console.log(`Game Over. User Score is ${userGameScore}`);
    alertBox.scrollTop = alertBox.scrollHeight;

    startButton.disabled = false;
    stopButton.disabled = true;
    window.removeEventListener("keydown", keyHandler, true);
}


function userKeyEntry() {
    console.log("Listening for keypress");
    window.addEventListener('keydown', keyHandler, false)
}

function setNbackValue() {
    let nbackSelect = document.getElementById("nbackSelect")
    nbackValue = nbackSelect.options[nbackSelect.selectedIndex].value;
    console.log(`nback value changed to ${nbackValue}`)
    initialize()
}

// startNewGame();


function initialize() {
    alertBox.innerHTML = "<h3> Choose 'N' and press START to play </h3>" + `Instructions: <br>
     <p> Press the RECALL! button when the number currently shown is what you saw ${nbackValue} rounds ago. <p>
     (You get ${maxRounds} rounds total)`;
}

initialize()

// listRepeatPoints(maxRepeatPoints)