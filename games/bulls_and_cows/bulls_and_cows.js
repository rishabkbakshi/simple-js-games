
const readline = require('readline');

const ANSWERS_LIST = ['lamp', 'chair', 'table', 'carpet', 'curtains'];
const GAME_VALUES = {
    actual_answer: "",
    max_tries: 3,
    current_try: 0
}

const generateAnswer = () => {
    const randomIndex = Math.floor(Math.random() * Math.floor(ANSWERS_LIST.length));
    GAME_VALUES.actual_answer = ANSWERS_LIST[randomIndex];
}


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (line) => {
    switch (line.trim()) {
        case 'y':
            startGame();
            break;
        case 'n':
            console.log('\nHave a great day!');
            process.exit(0);
            break;
        case 'exit':
            console.log('\nHave a great day!');
            process.exit(0);
            break;
        default:
            validateUserInput(line);
            break;
    }
    rl.prompt();
})

const displayGameIntro = () => {
    console.log("\n\nWelcome to Bulls and Cows, a fun word game.\n");
    console.log("          }   {         ___  \n");
    console.log("          (o o)        (o o)  \n");
    console.log("   /-------\\ /          \\ /-------\\ \n");
    console.log("  / | BULL |O            O| COW  | \\  \n");
    console.log(" *  |-,--- |              |------|  *  \n");
    console.log("    ^      ^              ^      ^ \n\n");
    console.log(`You have to guess the ISOGRAM I am thinking of! You have ${GAME_VALUES.max_tries} total tries to get the right word \n`)
    console.log("[HINTS]:\n");
    console.log(`[1]: There are ${GAME_VALUES.actual_answer.length} letters in the word`);
    console.log(`[2]: Number of bulls tells you how many correct letters are in their place`);
    console.log(`[3]: Number of cows tells you how many correct letters are not in their place`);
    console.log(`[4]: The word is something you may find in your bedroom \n\n`);
    console.log(`[INFO]: Enter "exit" at any point to quit the game \n\n`);
};

const getUserInput = () => {
    console.log("Enter your guess:")

};

const validateUserInput = (userInput) => {
    let charArr = stringToArray(userInput);
    const ansCharArr = stringToArray(GAME_VALUES.actual_answer);
    if (charArr.length != ansCharArr.length) {
        console.log(`Please enter a ${ansCharArr.length}-letter word. \n\n`)
        return getUserInput();
    }
    for (let i = 0; i < charArr.length; i++) {
        let element = charArr.splice(0, 1)
        if (charArr.indexOf(element[0]) > -1) {
            console.log("Please enter an Isogram. [AN ISOGRAM IS A WORD WITHOUT ANY REPEATING LETTERS]\n\n");
            return getUserInput();
        }
    }
    return calculateBullsAndCows(userInput);
};

const calculateBullsAndCows = (inputWord) => {
    GAME_VALUES.current_try++;
    const inputCharArr = stringToArray(inputWord);
    const ansCharArr = stringToArray(GAME_VALUES.actual_answer);
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
        console.log(`Bulls: ${result.bulls}  Cows: ${result.cows} \n`);
        console.log(`Congratulations! You guessed the word right! It was "${GAME_VALUES.actual_answer}" \nWanna play again? Enter (y/n):`);
    }
    else {
        if (GAME_VALUES.current_try < GAME_VALUES.max_tries) {
            console.log(`Bulls: ${result.bulls}  Cows: ${result.cows} \n`);
            console.log("Enter a new guess:")
        }
        else {
            console.log('\nSorry! You have run out of tries.Wanna Play again? Enter (y/n):\n');
        }
    }
}

const stringToArray = (inputString) => {
    let inputCharArr = [];
    for (let i = 0; i < (inputString.length); i++) {
        inputCharArr.push(inputString.charAt(i));
    }
    return inputCharArr;
}


const startGame = () => {
    GAME_VALUES.current_try = 0;
    generateAnswer();
    displayGameIntro();
    getUserInput();
}

startGame();