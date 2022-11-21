import Player from './Player.js'
import GameBoard from './GameBoard.js'
import GameDisplay from './GameDisplay.js'

export default (function (_player1, _player2) {
    const startForm = document.querySelector('.start-form');

    // Keeps track of the state of the game
    const GameState = {
        _player1: null,
        _player2: null,
        _curPlayer: null,
        _victory: false,
        _movesMade: 0
    }

    // Defines the players by name
    const _setPlayers = () => {
        const data = [...new FormData(startForm).values()];
        const [_player1, _player2] = data;
        GameState._player1 = Player(1, _player1, 'X');
        GameState._player2 = Player(2, _player2, 'O');
        GameState._curPlayer = GameState._player1;
    }

    // Show the names of the player at the top for score purposes
    const _showNames = () => {
        GameDisplay.player1Name.textContent = GameState._player1.name;
        GameDisplay.player2Name.textContent = GameState._player2.name;
        GameDisplay.names.show();
    }

    // Defines players based on menu form and shows their name
    const _showPlayers = () => {
        _setPlayers();
        _showNames();
    }

    // Add the functionality to all the board squares
    const _initSquares = () => {
        const allSquares = [...document.querySelectorAll('.square')];
        allSquares.forEach(square => square.addEventListener('click', _play));
    }

    // Increments the winner score
    const _incrementScore = () => {
        GameState._curPlayer.score++;
        const curPlayerClass = `player${GameState._curPlayer.order}Score`;
        GameDisplay[curPlayerClass].textContent = GameState._curPlayer.score;
    }

    /*
     Calls the necessary functions to start the game
     The steps considered are the following
        1. Hide the starting menu
        2. Show the game board
        3. Define the players and show their names
        4. Add the clicking functionality to the board squares
    */
    const startGame = (event) => {
        event.preventDefault();
        GameDisplay.menu.hide();
        GameBoard.init();
        _showPlayers();
        _initSquares();
    }

    // Changes the currently playing player
    const _changeCurPlayer = () => {
        if (GameState._curPlayer === GameState._player1) {
            GameState._curPlayer = GameState._player2;
        } else {
            GameState._curPlayer = GameState._player1;
        }
    }

    // Returns a boolean with the current state of the game
    const _isGameFinished = () => !!GameState._victory;

    // Verifies if the given array consist in a winner sequence ('XXX' or 'OOO')
    const _checkSquares = (array, board) => {
        console.log(board.map(square => square.getMark()))
        for (let arr of array) {
            const markerString = arr.map(pos => board[pos].getMark()).join('');
            if (/X{3}|O{3}/.test(markerString)) {
                return arr;
            }
        }
    };

    // Checks if any row, column or diagonal consists in a winner sequence
    const _checkVictory = () => {
        const board = GameBoard.getBoard();
        return _checkSquares(GameBoard.winnerSequences, board);
    }

    const _isTie = () => GameState._movesMade >= 9;

    const _restartState = () => {
        GameState._curPlayer = GameState._player1;
        GameState._victory = false;
        GameState._movesMade = 0;
    }

    // Restarts the game after a match
    const _restart = () => {
        _restartState()
        GameBoard.resetBoard();
    }

    // Ends the game when there is a winner or a tie
    const _end = (tie) => {
        if (!tie) {
            _incrementScore();
            const winnerString = `The winner is: ${GameState._curPlayer.name}`;
            GameDisplay.winnerName.textContent = winnerString;
        } else {
            GameDisplay.winnerName.textContent = "It's a tie";
        }

        GameDisplay.timedDisplay(
            [GameDisplay.winnerScreen],
            [GameDisplay.winnerScreen],
            2000,
            [_restart]
        )
    }

    const _defineVictory = (victoryCoords) => {
        GameState._victory = victoryCoords;
        GameBoard.highlightSquares(victoryCoords);
        _end(false);
    }

    const _handleChange = () => {
        GameState._movesMade++;
        const victoryCoords = _checkVictory();

        if (victoryCoords) {
            _defineVictory(victoryCoords);
        } else {
            _isTie() ? _end(true) : _changeCurPlayer();
        }
    }

    // Keeps the game running or stops it when necessary. Makes possible to actually play
    const _play = (event) => {
        if (_isGameFinished() || GameBoard.isMarked(event)) return;

        GameBoard.placeMarker(event, GameState._curPlayer);
        _handleChange();
    }

    startForm.addEventListener('submit', startGame);
})()