import Square from "./Square.js";
// Game Board module to keep information about the game board
export default (function(tableElement) {
    const _genBoard = () => [...Array(9)].map((_, pos) => Square(pos));
    const _board = _genBoard();

    const winnerSequences = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]

    // Returns one copy of the boards in its current state
    const getBoard = () => [..._board];

    // Returns a flat copy of the DOM Board
    const getDOMBoard = () => [...document.querySelectorAll('.square')];

    const getPos = ({ dataset: { pos } }) => Number(pos); 

    // Places the Player marker in the board and in the DOM representation of the board
    const placeMarker = ({ target: clickedElement }, curPlayer) => {
        const { marker } = curPlayer;
        const pos = getPos(clickedElement);
        const square = _board[pos];
        square.check(marker);
    }

    // Verifies if a specific square is marked in the _board
    const isMarked = ({ target: clickedElement }) => {
        const pos = getPos(clickedElement);
        return _board[pos].isChecked();
    }

    // Repeats an action, like a loop, but cleaner
    const _repeatAction = (action, times) => {
        for(let i = 0; i < times; i++) {
            action(i);
        }
    }

    // Creates one board row and returns it
    const _makeRow = () => {
        return document.createElement('tr');
    }

    // Creates one board column and returns it
    const _makeCol = (x, y) => {
        const col = document.createElement('td');
        col.dataset.pos = x * 3 + y;
        col.classList = 'square';
        return col;
    }

    // Fills one board row with columns
    const _fillRow = (row, rowNum) => {
        _repeatAction((colNum) => {
            row.append(_makeCol(rowNum, colNum));
        }, 3);
        return row;
    }
    
    // Creates all the board elements and renders everything in the DOM
    const init = () => {
        _repeatAction((rowNum) => {
            const row = _makeRow();
            _fillRow(row, rowNum);
            tableElement.append(row)
        }, 3)
    }

    // Highlights the winner sequence
    const highlightSquares = (positions) => {
        positions.forEach(pos => {
            const square = _board[pos];
            square.highlight();
        })
    }

    // Reset all the squares of the _board, removing the marks
    const resetBoard = () => {
        _board.forEach(square => square.uncheck());
    }

    return {
        init,
        placeMarker,
        getBoard,
        getDOMBoard,
        resetBoard,
        highlightSquares,
        isMarked,
        winnerSequences
    }

})(document.querySelector('table'))