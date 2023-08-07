const table = document.getElementById("board-wrapper"); // Grabs our table element
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
const myTable = document.getElementById('board');

// Creates a function that returns the index of an input box object from an HTML Collection
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
table.addEventListener("input", (event) => {
    const userInput = event.target.value; // Grabs the current value of whichever input field the user just modified
    const restrictChars = /[^1-9]/g // Defines a regex searching for anything except digits 1-9 
    // Checks if the user inputted any restricted chars
    if (restrictChars.test(userInput)) {
        event.target.value = userInput.replace(restrictChars, ""); // Replaces anything that isn't a digit from 1-9 with the empty string
    }
})

// Creates a function that either disables or enables the ability to edit input boxes based on the Boolean value passed in
const disableInputs = (bool) => {
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].disabled = bool;
    }
}
             
// This Arrow Function wipes the contents of all HTML input boxes & the global board variable
document.getElementById('clear').onclick = () => {
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
    document.getElementById('label').innerText = 'Please input a sudoku board';
    document.getElementById('solve').disabled = false;
}

document.getElementById('solve').onclick = () => {
    document.getElementById('solve').disabled = true;
    const readInputs = () => {
        const width = inputs.length / 9 - 1; // width of input-boxes in 0-index
        let row = 0;
        let column = 0;
        for (let i = 0; i < inputs.length; i++) {
            if (inputs[i].value !== '') {
                board[row][column] = Number(inputs[i].value);
            }
            if (column >= width) {
                column = 0;
                row++;
            } else {
                column++;
            }
        } 
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
    readInputs();
    solve();
    displayBoard();
    disableInputs(true);
    document.getElementById('label').innerText = 'Here\'s the solution!';
}