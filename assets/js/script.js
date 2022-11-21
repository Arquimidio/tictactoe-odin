// Factory that creates Player objects
const Player = function(order, name, marker) {
    return {
        order,
        name,
        marker,
        score: 0
    }
}

// Game Board module to keep information about the game board
const GameBoard = (function(tableElement) {

    const _board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
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

    const _chunk = (arr, size) => {
        if(arr.length <= size) return [arr];
        const cur = arr.slice(0, size);
        const rest = _chunk(arr.slice(size), size);
        return [cur, ...rest];
    }

    // Returns one copy of the boards in its current state
    const getBoard = () => [..._board.map(row => [...row])];

    const getDOMBoard = () => [...document.querySelectorAll('.square')];

    const getChunkedDOMBoard = () => {
        const squareArr = getDOMBoard();
        return _chunk(squareArr, 3)
    }

    const _getCoords = (element) => {
        return element.dataset.coords.split(' ');
    }

    // Places the Player marker in the board and in the DOM representation of the board
    const placeMarker = ({ target: clickedElement }, curPlayer) => {
        const { marker } = curPlayer;
        const [row, col] = _getCoords(clickedElement);
        _board[Number(row)][Number(col)] = marker;
        clickedElement.textContent = marker;
    }

    const isMarked = ({ target: clickedElement }) => {
        const [row, col] = _getCoords(clickedElement);
        return !!_board[row][col];
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
    
    // Creates all the board elements and renders everything in the DOM
    const init = () => {
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

    const _resetSquares = () => {
        _board.forEach((row, i) => {
            row.forEach((col, j) => _board[i][j] = '');
        })
    }

    const _resetDOMSquares = () => {
        const renderedBoard = getDOMBoard();
        renderedBoard.forEach(square => {
            square.classList.remove('highlight');
            square.textContent = '';
        })
    }

    const resetBoard = () => {
        _resetSquares(),
        _resetDOMSquares()
    }

    return {
        init,
        placeMarker,
        getBoard,
        getChunkedDOMBoard,
        resetBoard,
        highlightSquares,
        isMarked,
        rowCoords,
        colCoords,
        diagCoords
    }

})(document.querySelector('table'))

const GameDisplay = (function(){
    const controlDisplay = (element) => ({
        show(){
            element.classList.remove('hide')
        },
        hide() {
            element.classList.add('hide')
        }
    })

    const menu = controlDisplay(document.querySelector('.start-screen'));
    const names = controlDisplay(document.querySelector('.names'))
    const winnerScreen = controlDisplay(document.querySelector('.winner-screen'));
    const winnerName = document.querySelector('.winner');
    const player1Name = document.querySelector('.player1-name');
    const player1Score = document.querySelector('.player1-score');
    const player2Name = document.querySelector('.player2-name');
    const player2Score = document.querySelector('.player2-score');

    return {
        menu,
        names,
        winnerScreen,
        winnerName,
        player1Score,
        player1Name,
        player2Score,
        player2Name
    }
})()

// Ties everything together to make the game work
const Brain = (function(_player1, _player2) {
    const startForm = document.querySelector('.start-form');

    const GameState = {
        _player1: null,
        _player2: null,
        _curPlayer: null,
        _victory: false
    }

    const _setPlayers = () => {
        const data = [...new FormData(startForm).values()];
        const [_player1, _player2] = data;
        GameState._player1 = Player(1, _player1, 'X');
        GameState._player2 = Player(2, _player2, 'O');
        GameState._curPlayer = GameState._player1;
    }

    const _initSquares = () => {
        const allSquares = [...document.querySelectorAll('.square')];
        allSquares.forEach(square => square.addEventListener('click', _play));
    }

    const _showNames = () => {
        GameDisplay.player1Name.textContent = GameState._player1.name;
        GameDisplay.player2Name.textContent = GameState._player2.name;
        GameDisplay.names.show();
    }

    const _incrementScore = () => {
        GameState._curPlayer.score++;
        GameDisplay[`player${GameState._curPlayer.order}Score`].textContent = GameState._curPlayer.score;
    }

    const startGame = (event) => {
        event.preventDefault();
        GameBoard.init();
        _setPlayers();
        _showNames();
        _initSquares();
        GameDisplay.menu.hide();
    }

    // Changes the currently playing player
    const _changeCurPlayer = () => {
        if(GameState._curPlayer === GameState._player1) {
            GameState._curPlayer = GameState._player2;
        } else {
            GameState._curPlayer = GameState._player1;
        }
    }
 
    const _isGameFinished = () => !!GameState._victory;

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

    const _restart = () => {
        GameState._curPlayer = GameState._player1;
        GameState._victory = false;
        GameBoard.resetBoard();
    }
    
    const _end = () => {
        _incrementScore();
        GameDisplay.winnerName.textContent = GameState._curPlayer.name;
        GameDisplay.winnerScreen.show();
        _restart();
    }

    const _play = (event) => {
        if(_isGameFinished() || GameBoard.isMarked(event)) return;
        GameBoard.placeMarker(event, GameState._curPlayer);

        const victoryCoords = _checkVictory();
        if(victoryCoords) {
            GameState._victory = victoryCoords;
            GameBoard.highlightSquares(GameBoard.getChunkedDOMBoard(), victoryCoords);
            _end();
        } else {
            _changeCurPlayer();
        }
    }

    startForm.addEventListener('submit', startGame);
})()