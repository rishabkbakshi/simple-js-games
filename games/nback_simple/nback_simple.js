const maxNum = 9; // Maximum number to count until
const highlightColor = "#f00";  // Color of the highlighted square
const showTimeoutVal = 2500; // In milliseconds
const alertBox = document.getElementById("alertBox");
const startButton = document.getElementById("startNewGame");
const stopButton = document.getElementById("stopGame");
const recallButton = document.getElementById("recallButton");
const numberDisplay = document.getElementById("numberDisplay");

const maxRounds = 20
let currentRound = 1
let nbackValue = 2
let memoryCounter = []
let userChoices = []
let userSelectNum = 0
let userGameScore = 0
let showHighlightTimeout
let repeatRounds = [];


let maxrepeatRounds = 5;

// Generate a number between minVal and maxVal
function randomGenerator(minVal, maxVal) {
    return Math.floor(Math.random()*(parseInt(maxVal) - parseInt(minVal)+1) + parseInt(minVal) );
    // return Math.floor(Math.random() * (+maxVal - +minVal)) + +minVal;
}

// Generate the round numbers that will repeat
function createRepeatList() {
    for (let i = 0; i < maxrepeatRounds; i++) {
        let randomNum = randomGenerator(nbackValue + 1, maxRounds);
        console.log("Generated:", randomNum, "with", nbackValue , maxRounds);
        if (repeatRounds.includes(randomNum)) {
            maxrepeatRounds++;
            // try again with a new number to avoid duplicate place values
        } else {
            repeatRounds.push(randomNum);
        }
    }
    console.log(`Max Repeat Points: ${maxrepeatRounds}, Repeat Points List: ${repeatRounds}`);
}

function showNewNumber() {
    removeHighlight();

    // If current round number is one that should repeat, then show the user the value from n rounds back
    if (repeatRounds.includes(currentRound)) {
        userSelectNum = memoryCounter[currentRound - nbackValue -1]
        console.log(`Repeating Round - Round#: ${currentRound}, Numberlist: ${memoryCounter}, Current Number: ${userSelectNum}`)
    }
    // Else show the user a random number
    else {
        userSelectNum = randomGenerator(1, maxNum);
        console.log(`Non - Repeating Round - Round#: ${currentRound}, Numberlist: ${memoryCounter}, Current Number: ${userSelectNum}`)
    }

    numberDisplay.innerHTML = userSelectNum;
    memoryCounter.push(userSelectNum);


    showHighlightTimeout = setTimeout(() => {
        currentRound++;
        if (currentRound < maxRounds) { // If there are still rounds left
            showNewNumber();
        }
        else {
            stopGame();
        }
    }, showTimeoutVal);
}

function validateUserRecall() {
    let prevNbackValue = memoryCounter[memoryCounter.length -1 - nbackValue]
    console.log(prevNbackValue, userSelectNum);
    if (userSelectNum === prevNbackValue) {
        userGameScore++;
        successHighlight(userSelectNum)
        alertBox.innerHTML += ` <p> Success! Recalled ${userSelectNum} on turn ${currentRound}. Score: ${userGameScore}. </p>`
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
    recallButton.disabled = false;

    repeatRounds = [];

    createRepeatList()

    userGameScore = 0;
    memoryCounter = [];
    currentRound = 1;

    alertBox.innerHTML = `<p> Starting the game with N = ${nbackValue}. </p> 
    (Press 'Y' for when you see the same box highlighted)`
    console.log(`Starting with nback=${nbackValue}`)
    showNewNumber();
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
        else{
            html += `, ${memoryCounter[i]}`;
        }
    } 
    alertBox.innerHTML += html + ' ]';

    console.log(`Game Over. User Score is ${userGameScore}`);
    alertBox.scrollTop = alertBox.scrollHeight;

    startButton.disabled = false;
    stopButton.disabled = true;
    recallButton.disabled = true;
}

function setNbackValue() {
    let nbackSelect = document.getElementById("nbackSelect")
    nbackValue = parseInt(nbackSelect.options[nbackSelect.selectedIndex].value);
    console.log(`nback value changed to ${nbackValue}`)
    initialize()
}

function initialize() {
    recallButton.disabled = true;
    stopButton.disabled = true;
    startButton.disabled = false;

    alertBox.innerHTML = "<h3> Choose 'N' and press START to play </h3>" + `Instructions: <br>
     <p> Press the RECALL! button when the number currently shown is what you saw ${nbackValue} round(s) ago. <p>
     (You get ${maxRounds} rounds total)`;
}



// Runs on page load
initialize()
