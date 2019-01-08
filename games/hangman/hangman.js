
let HANGMAN_WORD = "";
let CURRENT_TRY = 1;
let userInputArr = [];

const WORDS_LIST = [
    'india', 'germany', 'nepal', 'oman', 'france',
    'italy', 'croatia', 'mexico', 'brazil', 'uruguay',
    'egypt', 'turkey', 'spain', 'belgium', 'nigeria',
    'russia', 'bahrain', 'canada', 'chile', 'iran'
];

const generateWord = () => {
    const randomIndex = Math.floor(Math.random() * Math.floor(WORDS_LIST.length));
    HANGMAN_WORD = WORDS_LIST[randomIndex];
    console.log(HANGMAN_WORD);
}

const letterBox = document.getElementById("letterBox");
const hangmanCanvas = document.getElementById("hangmanCanvas");
const incorrectBox = document.getElementById("incorrectBox");

const canvas_width = hangmanCanvas.width;
const canvas_height = hangmanCanvas.height;

const onUserInput = (e) => {
    const userInput = e.target.value;
    (userInput.length > 1) ? alert("Please enter one letter") : (userInputArr.indexOf(userInput) > -1) ? alert("You already entered this letter!") : evaluateInput(userInput)
    e.target.value = "";
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
    console.log(inputLetter, indices);
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
    userInputArr.push(inputLetter);
    let blankArr = Array.from(letterBox.childNodes);
    console.log(letterIndices)
    letterIndices.forEach((letterIndex, i) => {
        console.log(letterIndex);
        blankArr.forEach((blank, j) => {
            if (letterIndex === j) {
                console.log(letterIndex, j);
                blankArr[j].innerHTML = inputLetter;
                if(userInputArr.length == HANGMAN_WORD.length){
                    gameIsWon();
                }
            }
        })
    })
}

const addToIncorrectBox = (incorrectLetter) => {
    incorrectBox.innerHTML += incorrectLetter + ', ';
}

const drawHangman = (inputLetter) => {
    console.log("Hangman");
    switch (CURRENT_TRY) {
        case 1:
            drawLineParts(0.25 * canvas_width, 0.05 * canvas_height, 0.75 * canvas_width, 0.05 * canvas_height)
            break;
        case 2:
            drawLineParts(0.5 * canvas_width, 0.05 * canvas_height, 0.5 * canvas_width, 0.25 * canvas_height)
            break;
        case 3:
            drawHead();
            break;
        case 4:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.35 * canvas_width, 0.65 * canvas_height);
            break;
        case 5:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.65 * canvas_width, 0.65 * canvas_height);
            break;
        case 6:
            drawLineParts(0.5 * canvas_width, 0.45 * canvas_height, 0.5 * canvas_width, 0.75 * canvas_height);
            break;
        case 7:
            drawLineParts(0.5 * canvas_width, 0.75 * canvas_height, 0.35 * canvas_width, 0.95 * canvas_height);
            break;
        case 8:
            drawLineParts(0.5 * canvas_width, 0.75 * canvas_height, 0.65 * canvas_width, 0.95 * canvas_height);
            setTimeout(hangmanIsDead,1000);
            break;
        default:
            hangmanIsDead();
            console.log("game over");
    }
    CURRENT_TRY++;
    addToIncorrectBox(inputLetter);
}

const drawLineParts = (startX, startY, endX, endY) => {
    const ctx = hangmanCanvas.getContext("2d");
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
}

const drawHead = () => {
    const ctx = hangmanCanvas.getContext("2d");
    ctx.beginPath();
    ctx.arc(0.5 * canvas_width, 0.35 * canvas_height, (0.10 * canvas_height), 0, 2 * Math.PI);
    ctx.stroke();
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
    const context = hangmanCanvas.getContext('2d');
    context.clearRect(0, 0, canvas_width, canvas_height);
}

const startNewGame = () => {
    generateWord();
    initializeBlanks();
    CURRENT_TRY = 1;
    clearCanvas();
    incorrectBox.innerHTML = '';
    userInputArr = [];
}

startNewGame();

