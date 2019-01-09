
const ANSWERS_LIST = [
    'germany', 'nepal', 'oman', 'france',
    'italy', 'mexico', 'brazil', 'egypt', 'turkey', 'spain', 'belgium',
    'chile', 'iran', 'wales', 'denmark'
];

const GAME_VALUES = {
    actual_answer: "oman",
    max_tries: 10,
    current_try: 0
}

const userInput = document.getElementById("userInput");

// getinput
// validateinput
// word length match
// should be isogram
// should only have characters
// countbullsandcows
// show result

const generateAnswer = () => {
    const randomIndex = Math.floor(Math.random() * Math.floor(ANSWERS_LIST.length));
    GAME_VALUES.actual_answer = ANSWERS_LIST[randomIndex];
    console.log(ANSWERS_LIST[randomIndex]);
}

const submitGuess = () => {
    let user_input = userInput.value;
    validateUserInput(user_input);
    userInput.value = "";
    userInput.focus();
}


// const displayGameIntro = () => {
//     console.log("\n\nWelcome to Bulls and Cows, a fun word game.\n");
//     console.log("          }   {         ___  \n");
//     console.log("          (o o)        (o o)  \n");
//     console.log("   /-------\\ /          \\ /-------\\ \n");
//     console.log("  / | BULL |O            O| COW  | \\  \n");
//     console.log(" *  |-,--- |              |------|  *  \n");
//     console.log("    ^      ^              ^      ^ \n\n");
//     console.log(`You have to guess the ISOGRAM I am thinking of! You have ${GAME_VALUES.max_tries} total tries to get the right word \n`)
//     console.log("[HINTS]:\n");
//     console.log(`[1]: There are ${GAME_VALUES.actual_answer.length} letters in the word`);
//     console.log(`[2]: Number of bulls tells you how many correct letters are in their place`);
//     console.log(`[3]: Number of cows tells you how many correct letters are not in their place`);
//     console.log(`[4]: The word is something you may find in your bedroom \n\n`);
//     console.log(`[INFO]: Enter "exit" at any point to quit the game \n\n`);
// };

const lettersOnlyCheck = (textInput) => {
    let lettersRegex = /^[A-Za-z]+$/;
    if (textInput.match(lettersRegex)) {
        return true;
    }
    else {
        return false;
    }
}

const validateUserInput = (userInput) => {
    let charArr = Array.from(userInput);
    let ansCharArr = Array.from(GAME_VALUES.actual_answer);
    console.log(charArr, ansCharArr)

    // Check for word length match
    if (charArr.length != ansCharArr.length) {
        alert(`Please enter a ${ansCharArr.length}-letter word as the correct answer is ${ansCharArr.length}-letter long`)
        return;
    }
    else if (!lettersOnlyCheck(userInput)) {
        alert("Please enter letters from the alphabet only");
        return;
    }
    else {
        // Check if Isogram or not
        for (let i = 0; i < charArr.length; i++) {
            let element = charArr.splice(0, 1)
            if (charArr.indexOf(element[0]) > -1) {
                alert("Please enter an Isogram. [AN ISOGRAM IS A WORD WITHOUT ANY REPEATING LETTERS]");
                return;
            }
        }
        return calculateBullsAndCows(userInput);
    }
};

const resetGame = () => {
    GAME_VALUES.current_try = 0;
    document.querySelector('.guess-container').innerHTML = "<p>A new game has begun!<p> <p>Enter your first guess:</p> <p>Scroll down for Game Rules</p>";
    generateAnswer();
}

const calculateBullsAndCows = (inputWord) => {
    if(GAME_VALUES.current_try == 0){
        document.querySelector('.guess-container').innerHTML = "";
    }
    GAME_VALUES.current_try++;
    const inputCharArr = Array.from(inputWord);
    const ansCharArr = Array.from(GAME_VALUES.actual_answer);

    let result = { "bulls": 0, "cows": 0 }

    for (let i = 0; i < ansCharArr.length; i++) {
        for (let j = 0; j < inputCharArr.length; j++) {
            if ((inputCharArr[j] === ansCharArr[i])) {
                if (j === i) {
                    result.bulls++;
                }
                else {
                    result.cows++;
                }
            }
        }
    }
    if (result.bulls === ansCharArr.length) {
        console.log(`Bulls: ${result.bulls}  Cows: ${result.cows}`);
        let guess = {
            bulls: result.bulls,
            cows: result.cows,
            inputWord: inputWord
        }
        appendToGuessContainer(guess);
        alert(`Congratulations! You guessed the word right! It was "${GAME_VALUES.actual_answer}"`);
        resetGame();
    }
    else {
        if (GAME_VALUES.current_try <= GAME_VALUES.max_tries) {
            console.log(`Bulls: ${result.bulls}  Cows: ${result.cows}`);
            let guess = {
                bulls: result.bulls,
                cows: result.cows,
                inputWord: inputWord
            }
            appendToGuessContainer(guess);
            return;
        }
        else {
            alert(`Sorry! You have run out of tries. The word was ${GAME_VALUES.actual_answer}`);
            resetGame();
        }
    }
}

const appendToGuessContainer = (result) => {
    let resultDiv = document.createElement('div');
    let guessContainer = document.querySelector('.guess-container');
    resultDiv.classList.add('guess-result', 'mv3');
    resultDiv.innerHTML += `<p>Guess ${GAME_VALUES.current_try}: ${result.inputWord} </p> [Bulls: ${result.bulls}]   [Cows: ${result.cows}]`
    guessContainer.append(resultDiv);
}

resetGame();