
let HANGMAN_WORD = "";
let CURRENT_TRY = 1;
let userInputArr = [];
let incorrectLetterArr = [];

const WORDS_LIST = [
    'india', 'germany', 'nepal', 'oman', 'france',
    'italy', 'croatia', 'mexico', 'brazil', 'uruguay',
    'egypt', 'turkey', 'spain', 'belgium', 'nigeria',
    'russia', 'bahrain', 'canada', 'chile', 'iran'
];

const generateWord = () => {
    const randomIndex = Math.floor(Math.random() * Math.floor(WORDS_LIST.length));
    HANGMAN_WORD = WORDS_LIST[randomIndex];
    // console.log(HANGMAN_WORD);
}

const letterBox = document.getElementById("letterBox");
let hangmanCanvas = document.getElementById("hangmanCanvas");
let context = hangmanCanvas.getContext('2d')
const incorrectBox = document.getElementById("incorrectBox");
const userInputBox = document.getElementById("userInput"); 

const canvas_width = hangmanCanvas.width;
const canvas_height = hangmanCanvas.height;

const startNewGame = () => {
    generateWord();
    initializeBlanks();
    CURRENT_TRY = 1;
    clearCanvas();
    incorrectBox.innerHTML = '';
    userInputArr = [];
    incorrectLetterArr = [];
}

document.querySelector('#userInput').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      onUserInput()
    }
});

const onUserInput = () => {
    const userInput = userInputBox.value.toLowerCase();
    (userInput.length > 1) ? alert("Please enter one letter")
     : (userInputArr.indexOf(userInput) > -1) ? alert("You already entered this letter!")
      : (incorrectLetterArr.indexOf(userInput) > -1) ? alert("You already entered this.")
       : evaluateInput(userInput)
    userInputBox.value = "";
    userInputBox.focus();
}

const evaluateInput = (inputLetter) => {
    const letterIndices = findIndices(HANGMAN_WORD, inputLetter);
    (letterIndices.length > 0) ? placeLetter(inputLetter, letterIndices) : drawHangman(inputLetter);
}

const findIndices = (inputString, inputLetter) => {
    let indices = [];
    let inputArr = Array.from(inputString)
    inputArr.forEach((char, index) => {
        if (char === inputLetter) {
            indices.push(index);
        }
    });
    return indices;
}

const gameIsWon = () => {
    alert("Congratulations! Hangman survived!");
    startNewGame();
}

const hangmanIsDead = () => {
    alert(`Oh no! Hangman was executed! Answer: ${HANGMAN_WORD}`);
    startNewGame();
}

const placeLetter = (inputLetter, letterIndices) => {
    let blankArr = Array.from(letterBox.childNodes);
    letterIndices.forEach((letterIndex, i) => {
        blankArr.forEach((blank, j) => {
            if (letterIndex === j) {
                blankArr[j].innerHTML = inputLetter;
                userInputArr.push(inputLetter);
                if (userInputArr.length == HANGMAN_WORD.length) {

                    gameIsWon();
                }
            }
        })
    })
}

const addToIncorrectBox = (incorrectLetter) => {
    incorrectBox.innerHTML += incorrectLetter + ', ';
}

const drawLineParts = (startX, startY, endX, endY) => {
    // const context = hangmanCanvas.getContext("2d");
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
}

const drawHead = () => {
    // const context = hangmanCanvas.getContext("2d");
    context.beginPath();
    context.arc(0.5 * canvas_width, 0.35 * canvas_height, (0.10 * canvas_height), 0, 2 * Math.PI);
    context.stroke();
}


const drawHangman = (inputLetter) => {
    console.log("Hangman", CURRENT_TRY);
    switch (CURRENT_TRY) {
        case 1:
            drawHead(); //Head
            break;
        case 2:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.5 * canvas_width, 0.75 * canvas_height); //body
            break;
        case 3:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.35 * canvas_width, 0.65 * canvas_height); // left hand
            break;
        case 4:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.65 * canvas_width, 0.65 * canvas_height); // right hand
            break;
        case 5:
            drawLineParts(0.5 * canvas_width, 0.75 * canvas_height, 0.65 * canvas_width, 0.95 * canvas_height); //Right Leg
            break;
        case 6:
            drawLineParts(0.5 * canvas_width, 0.05 * canvas_height, 0.5 * canvas_width, 0.25 * canvas_height) //rope
            break;
        case 7:
            drawLineParts(0.5 * canvas_width, 0.75 * canvas_height, 0.35 * canvas_width, 0.95 * canvas_height); //left leg
            break;
        case 8:
            drawLineParts(0.25 * canvas_width, 0.05 * canvas_height, 0.75 * canvas_width, 0.05 * canvas_height) //wood
            setTimeout(hangmanIsDead, 500);
            break;
        default:
            hangmanIsDead();
            break;
    }
    CURRENT_TRY++;
    addToIncorrectBox(inputLetter);
    incorrectLetterArr.push(inputLetter);
}


const initializeBlanks = () => {
    letterBox.innerHTML = '';
    for (let i = 0; i < HANGMAN_WORD.length; i++) {
        const blank = document.createElement('div');
        blank.classList.add('hangman-blank', 'shadow-3')
        letterBox.append(blank)
    }
}

const clearCanvas = () => {
    context.fillStyle = "white";
    //   context.fillRect(10, 10, 100, 50);
    context.fillRect(0, 0, canvas_width, canvas_height);
}



startNewGame();

