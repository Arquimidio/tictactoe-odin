import Player from './Player.js'
import GameBoard from './GameBoard.js'
import GameDisplay from './GameDisplay.js'

export default (function(_player1, _player2) {
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