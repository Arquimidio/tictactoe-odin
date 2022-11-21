import Square from "./Square.js";
// Game Board module to keep information about the game board
export default (function(tableElement) {
    const genBoard = () => [...Array(9)].map((_, pos) => Square(tableElement, pos));
    let _board;

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
    const placeMarker = (
        { target: clickedElement }, 
        curPlayer
    ) => {
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

    const init = () => {
        _board = genBoard();
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

})(document.querySelector('tr'))