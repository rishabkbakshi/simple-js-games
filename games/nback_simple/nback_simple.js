const maxNum = 9; // Maximum number to count until
const highlightColor = "#f00";  // Color of the highlighted square
const showTimeoutVal = 2500; // In milliseconds
const alertBox = document.getElementById("alertBox");
const statsDisplay = document.getElementById('statsDisplay');
const startButton = document.getElementById("startNewGame");
const stopButton = document.getElementById("stopGame");
const recallButton = document.getElementById("recallButton");

const numberDisplay = document.getElementById("numberDisplay");
// const chartCanvas = document.getElementById("scoreChart").getContext('2d')
// let scoreChart


const upperAlphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
const lowerAlphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"]

const maxRounds = 20
let currentRound = 1
let nbackValue = 2
let memoryCounter = []
let userChoices = []
let userSelectNum = 0
let userGameScore = 0
let totalRepeats = 0;
let showHighlightTimeout
let nextLetterTimeout
let repeatRounds = [];
let progressCircle
let maxrepeatRounds = 5;


// const ProgressBar = require('progressbar.js')
window.onload = function onLoad() {
    progressCircle = new ProgressBar.Circle('.main-display',{
        strokeWidth:4,
        color: '#eee'
    });

    progressCircle.animate(1);

    // generateChart()
};

// Generate a number between minVal and maxVal
function randomGenerator(minVal, maxVal, letterArr) {
    if (letterArr) {
        return letterArr[Math.floor(Math.random() * letterArr.length)]
    } else {
        return Math.floor(Math.random() * (parseInt(maxVal) - parseInt(minVal) + 1) + parseInt(minVal));
    }
}

// Generate the round numbers that will repeat
function createRepeatList() {
    for (let i = 0; i < maxrepeatRounds; i++) {
        let randomNum = randomGenerator(nbackValue + 1, maxRounds);
        console.log("Generated:", randomNum, "with", nbackValue, maxRounds);
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
    // If current round number is one that should repeat, then show the user the value from n rounds back
    if (repeatRounds.includes(currentRound)) {
        userSelectNum = memoryCounter[currentRound - nbackValue - 1]
        console.log(`Repeating Round - Round#: ${currentRound}, Numberlist: ${memoryCounter}, Current Number: ${userSelectNum}`)
        totalRepeats++;
    }
    // Else show the user a random number
    else {
        userSelectNum = randomGenerator(1, maxNum, upperAlphabet);
        console.log(`Non - Repeating Round - Round#: ${currentRound}, Numberlist: ${memoryCounter}, Current Number: ${userSelectNum}`)

        if(userSelectNum === memoryCounter[currentRound - nbackValue - 1]){
            totalRepeats++
        }
    }

    progressCircle.animate(currentRound / maxRounds);
    numberDisplay.innerHTML = userSelectNum;

    memoryCounter.push(userSelectNum);


    showHighlightTimeout = setTimeout(() => {
        numberDisplay.innerHTML = " ";
        removeHighlight();

        nextLetterTimeout = setTimeout(() => {
            currentRound++;

            if (currentRound < maxRounds) { // If there are still rounds left
                showNewNumber();
            }
            else {
                stopGame();
            }
        }, 1000)

    }, showTimeoutVal);
}

function onRecall(){
    if(numberDisplay.innerHTML != " "){
        validateUserRecall();
    }
}

function validateUserRecall() {
    let prevNbackValue = memoryCounter[memoryCounter.length - 1 - nbackValue]
    console.log(prevNbackValue, userSelectNum);
    if (userSelectNum === prevNbackValue) {
        userGameScore++;
        successHighlight(userSelectNum)
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
    totalRepeats = 0;

    statsDisplay.innerHTML = `Final Score: ${userGameScore} <br> <br> Success Percentage: 0%<br> <br>`;
    showNewNumber();
}

function stopGame() {
    clearTimeout(nextLetterTimeout);
    clearTimeout(showHighlightTimeout);
    memoryCounter.push(userSelectNum);
    removeHighlight()
    progressCircle.animate(1);

    statsDisplay.innerHTML = `<h3> GAME OVER </h3> <br> Final Score: ${userGameScore} <br> <br> Success Percentage: ${userGameScore/totalRepeats * 100}% <br> <br>`;
    var html = 'Number Series:' + '<br> [';
    for (var i = 0; i < memoryCounter.length - 1 ; i++) {
        if (i == 0) {
            html += ` ${memoryCounter[i]}`;
        }
        else {
            html += `, ${memoryCounter[i]}`;
        }
    }
    statsDisplay.innerHTML += html + ' ]';
    numberDisplay.innerHTML = " ";

    console.log(`Game Over. User Score is ${userGameScore}`);

    startButton.disabled = false;
    stopButton.disabled = true;
    recallButton.disabled = true;

    numberDisplay.innerHTML = `<div style="font-size: 30px; margin-top:60px;"> GAME <br> OVER </div>`
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

    alertBox.innerHTML =`<h3> Instructions: </h3>
     <p> Press the "RECALL!" button or the "<" button on your controller when the letter currently shown is what you saw ${nbackValue} round(s) ago. (Based on n you selected) <p>
     (You get ${maxRounds} rounds total)`;

    statsDisplay.innerHTML = `Final Score: 0 <br><br> Success Percentage: 0%`;

    numberDisplay.innerHTML = `<div style="font-size: 30px; margin-top:60px;"> NEW <br> GAME </div>`
}

// function generateChart() {

//     let data = {
//         datasets: [{
//             data: [0,1],
//             backgroundColor: [
//                 '#eee',
//                 '#333',
//             ],
//             borderWidth: 4
//         }],

//         // These labels appear in the legend and in the tooltips when hovering different arcs
//         // labels: [
//         //     'Correct',
//         //     'Incorrect'
//         // ]
//     }

//     scoreChart = new Chart(chartCanvas, {
//         type: 'pie',
//         data: data,
//         options: {
//             // legend: true,
//             // tooltips:{
//             //     titleFontSize: '140',
//             //     bodyFontSize: '30',
//             //     xPadding: '10',
//             //     yPadding:'10'
//             // }
//             // elements: {
//             //     arc: {
//             //         borderWidth: 4
//             //     }
//             // }
//         }
//     });
//     // Chart.defaults.global.elements.rectangle.borderWidth = 2;
// }

// function updateChart(){
//     scoreChart.data.datasets.forEach((dataset) => {
//         dataset.data = [userGameScore, totalRepeats - userGameScore]
//     });
//     scoreChart.update();
// }


// function userKeyEntry() {
window.addEventListener('keydown', keyHandler, false)
// }
function keyHandler(e) {
    if (e.keyCode == 33) { // for PGUP or LEFT in the presenter
        if(numberDisplay.innerHTML != " "){
            e.preventDefault();
            validateUserRecall();
        }
    }
    else if (e.keyCode == 66) { // for b or STOP in the presenter
        e.preventDefault();
        if (startButton.disabled === false) {
            console.log("Starting game")
            startNewGame();
        } else if (startButton.disabled === true) {
            console.log("Stopping game")
            stopGame();
        }
    }
}




// Runs on page load
initialize()