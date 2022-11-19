// Factory that creates Player objects
const Player = function(name, marker) {
    return {
        name,
        marker
    }
}

// Game State module to keep information about the state of the game
const GameState = (function(_player1, _player2) {
    let _curPlayer = _player1;
    let _isFinished = false;

    // Changes the currently playing player
    const changeCurPlayer = () => {
        if(_curPlayer === _player1) {
            _curPlayer = _player2;
        } else {
            _curPlayer = _player1;
        }
    }
 

    const getCurPlayer = () => _curPlayer;
    const isGameFinished = () => _isFinished;

    return {
        changeCurPlayer,
        getCurPlayer,
        isGameFinished
    }
    
})(Player('Josh', 'X'), Player('Bron', 'O'))

// Game Board module to keep information about the game board
const GameBoard = (function(tableElement) {

    const _board = [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_']
    ]

    // Places the Player marker in the board and in the DOM representation of the board
    const _placeMarker = ({ target: clickedElement }) => {
        const { marker } = GameState.getCurPlayer();
        const [row, col] = clickedElement.dataset.coords.split(' ');
        _board[Number(row)][Number(col)] = clickedElement.textContent =  marker;
        GameState.changeCurPlayer();
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
        col.dataset.coords = `${x} ${y}`;
        col.addEventListener('click', _placeMarker, { once: true });
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

    // Returns one copy of the boards in its current state
    const getBoard = () => [..._board.map(row => [...row])];

    // Creates all the board elements and renders everything in the DOM
    const initialize = () => {
        _repeatAction((rowNum) => {
            const row = _makeRow();
            _fillRow(row, rowNum);
            tableElement.append(row)
        }, 3)
    }

    return {
        initialize,
        getBoard
    }

})(document.querySelector('table'))

// Ties everything together to make the game work
const Brain = (function() {
    GameBoard.initialize();
})()