const board = [[0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0],
               [0,0,0,0,0,0,0,0,0]];
const inputs = document.getElementsByClassName('input');  // Selects all input boxes from the document -> HTML Collection
const myTable = document.getElementById('board'); // Grabs our table element
const solveButton = document.getElementById('solve'); // Selects the 'solve' HTML button
const clear = document.getElementById('clear'); // Grabs the 'clear' HTML button
const label = document.getElementById('label'); // Grabs the label text above the sudoku board

const readInputs = () => {
    let inputHashmap = new Map();
    const width = inputs.length / 9 - 1; // width of input-boxes in 0-index
    let row = 0;
    let column = 0;
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== '') {
            board[row][column] = Number(inputs[i].value);
            if (inputHashmap.get(Number(inputs[i].value)) !== undefined) {
                inputHashmap.get(Number(inputs[i].value)).push([row, column]);
            } else {
                inputHashmap.set(Number(inputs[i].value), [[row, column]]);
            }
        }
        if (column >= width) {
            column = 0;
            row++;
        } else {
            column++;
        }
    }
    return inputHashmap;
}

const boxCheck = (row, column) => {
    if (row < 3 && column < 3) {
        return 1;
    } else if (row < 3 && column >= 3 && column < 6) {
        return 2;
    } else if (row < 3 && column >= 6) {
        return 3;
    } else if (row >= 3 && row < 6 && column < 3) {
        return 4;
    } else if (row >= 3 && row < 6 && column >= 3 && column < 6) { 
        return 5;
    } else if (row >= 3 && row < 6 && column > 6) {
        return 6;
    } else if (row >= 6 && column < 3) {
        return 7;
    } else if (row >= 6 && column >= 3 && column < 6) {
        return 8;
    } else {
        return 9;
    }
}

// Boolean function that returns true or false depending on the validity of the inputted board by the user
const validBoard = (regInputs) => {
    for (let num of regInputs.keys()) {
        numArray = regInputs.get(num);
        if (numArray.length > 18) { // User inputted a singular number more than 9 times
            return false;
        } else if (numArray.length <= 1) { // User only inputted this number once
            continue;
        } else {
            for (let i = 0; i < numArray.length - 1; i++) {
                for (let j = i+1; j < numArray.length; j++) {
                    // Checks if the same number was put in either the same row or column
                    if (numArray[i][0] === numArray[j][0] || numArray[i][1] === numArray[j][1]) {
                        return false;
                    } // Checks if the same number was put inside the same 3x3 box
                    else if (boxCheck(numArray[i][0], numArray[i][1]) === boxCheck(numArray[j][0], numArray[j][1])) {
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

const findEmptySquares = () => {
    emptySquares = [];
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                emptySquares.push([i, j]);
            }
        }
    }
    return emptySquares;
}

const validNum = (num, row, column) => {
        const leftColumnBox = column % 3;
        const upperRowBox = row % 3;
        const start = [row - upperRowBox, column - leftColumnBox];
        for (let i = 0; i < (board.length - 1); i++) {
            // Checks if the current row or column of a specific square already has num inside it
            if (num === board[row][i] || num === board[i][column]) {
                return false;
            }
            // Checks if the current 3x3 box already has num inside it
            if (num === board[start[0]][start[1]] && start[1] !== column && start[0] !== row) {
                return false;
            }
            // Updates the start variable to the next 3x3 box
            if ((i + 1) % 3 === 0) {
                start[0]++; 
                start[1] = column - leftColumnBox;
            } else {
                start[1]++;
            }
        }
        return true;
}

// Backtracking Algorithm
const solve = () => { 
    let emptySquares = findEmptySquares();
    if (emptySquares.length === 0) {
        return board;
    } else {
        let row = emptySquares[0][0];
        let column = emptySquares[0][1];
        for (let num = 1; num < 10; num++){
            if (validNum(num, row, column)) {
                board[row][column] = num;
                if (solve()) {
                    return true;
                } else {
                    board[row][column] = 0;
                }
            } 
        }
        return false;
    }
}

const displayBoard = () => {
    let index = 0;
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            inputs[index].value = board[i][j];
            index++;
        }
    }
}

const solvable = (bool) => {
    if (bool) {
        solve();
        displayBoard();
        disableInputs(true);
        label.innerText = 'Here\'s the solution!';
    } else {
        label.innerText = 'Seems like this one has no solution!';
    }
}

const disableInputs = (bool) => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = bool;
    }
}

const findIndex = (cell, list) => {
    for (let i = 0; i < list.length; i++) {
        if (inputs[i] === cell) {
            return i;
        }
    }
}
// Creates an event listener that allows the user to navigate the input boxes using the arrow keys 
myTable.onkeydown = (event) => {
    if (event.keyCode >= 37 && event.keyCode <= 40) {
        let currentCell = document.getElementById(event.target.id); // Gives us the current input box that is focused on
        let cellIndex = findIndex(currentCell, inputs); // Find currentCell's index
        currentCell.blur(); // Removes the user's focus on this input box

        if (event.keyCode === 37) { // Checks if the left arrow key is struck
            inputs[cellIndex - 1].focus();
        } else if (event.keyCode === 38) { // Checks if the up arrow key is struck
            cellIndex <= 8 ? document.getElementById('clear').focus() : inputs[cellIndex - 9].focus();
        } else if (event.keyCode === 39) { // Checks if the right arrow key is struck
            inputs[cellIndex + 1].focus();
        } else { // Checks if the down arrow key is struck
            cellIndex >= 72 ? document.getElementById('solve').focus() : inputs[cellIndex + 9].focus();
        }
    }
}
// Creates an event listener that is executed anytime a user inputs something on the webpage
myTable.addEventListener("input", (event) => {
    const userInput = event.target.value; // Grabs the current value of whichever input field the user just modified
    const restrictChars = /[^1-9]/g // Defines a regex searching for anything except digits 1-9 
    // Checks if the user inputted any restricted chars
    if (restrictChars.test(userInput)) {
        event.target.value = userInput.replace(restrictChars, ""); // Replaces anything that isn't a digit from 1-9 with the empty string
    }
})     
// This Arrow Function wipes the contents of all HTML input boxes & the global board variable
clear.onclick = () => {
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].value !== '') {
            inputs[i].value = '';
        }
    }
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            board[i][j] = 0;
        }
    }
    disableInputs(false);
    label.innerText = 'Please input a sudoku board';
    solveButton.disabled = false;
}
// This Arrow Function calls all the functions needed to solve the sudoku board
solveButton.onclick = () => {
    solveButton.disabled = true;
    let regInputs = readInputs();
    let canBeSolved = validBoard(regInputs);
    solvable(canBeSolved);
}