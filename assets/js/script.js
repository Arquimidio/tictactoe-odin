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
    let _victory = false;

    // Changes the currently playing player
    const changeCurPlayer = () => {
        if(_curPlayer === _player1) {
            _curPlayer = _player2;
        } else {
            _curPlayer = _player1;
        }
    }
 
    const getVictory = () => _victory;
    const setVictory = (victory) => _victory = victory;
    const getCurPlayer = () => _curPlayer;
    const isGameFinished = () => !!getVictory();

    return {
        changeCurPlayer,
        getCurPlayer,
        getVictory,
        setVictory,
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

    const rowCoords = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]]
    ]

    const colCoords = [
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]]
    ]

    const diagCoords = [
        [[0, 0], [1, 1], [2, 2]],
        [[2, 0], [1, 1], [0, 2]]
    ]

    // Places the Player marker in the board and in the DOM representation of the board
    const placeMarker = ({ target: clickedElement }) => {
        const { marker } = GameState.getCurPlayer();
        const [row, col] = clickedElement.dataset.coords.split(' ');
        _board[Number(row)][Number(col)] = clickedElement.textContent =  marker;
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

    const highlightSquares = (squares, coords) => {
        coords.forEach(([x, y]) => {
            (squares[x][y]).classList.add('highlight')
        })
    }

    return {
        initialize,
        placeMarker,
        getBoard,
        highlightSquares,
        rowCoords,
        colCoords,
        diagCoords
    }

})(document.querySelector('table'))

// Ties everything together to make the game work
const Brain = (function() {
    GameBoard.initialize();
    const allSquares = [...document.querySelectorAll('.square')];

    const _chunk = (arr, size) => {
        if(arr.length <= size) return [arr];
        const cur = arr.slice(0, size);
        const rest = _chunk(arr.slice(size), size);
        return [cur, ...rest];
    }

    const _checkSquares = (array, board) => {
        for(let arr of array) {
            const markerString = arr.map(([x, y]) => board[x][y]).join('');
            if(/X{3}|O{3}/.test(markerString)) {
                return arr;
            }
        }
    };
    
    const _checkVictory = () => {
        const board = GameBoard.getBoard();
        const {rowCoords, colCoords, diagCoords} = GameBoard;
        const victoryRow = _checkSquares(rowCoords, board);
        const victoryCol = _checkSquares(colCoords, board);
        const victoryDiag = _checkSquares(diagCoords, board);
        return victoryRow || victoryCol || victoryDiag;
    }
    
    const _end = () => {
        console.log(GameState.getCurPlayer());
    }

    const _play = (event) => {
        if(GameState.isGameFinished()) return;
        GameBoard.placeMarker(event);

        const victoryCoords = _checkVictory();
        if(victoryCoords) {
            GameState.setVictory(_checkVictory());
            GameBoard.highlightSquares(_chunk(allSquares, 3), victoryCoords);
            _end();
        } else {
            GameState.changeCurPlayer();
        }
    }

    allSquares.forEach(square => square.addEventListener('click', _play, { once: true }));
})()