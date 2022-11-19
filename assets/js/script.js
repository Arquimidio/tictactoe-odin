const Player = function(name, marker) {
    return {
        name,
        marker
    }
}

const GameState = (function(_player1, _player2) {
    let _curPlayer = _player1;
    let _isFinished = false;

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

const GameBoard = (function(tableElement) {

    const _board = [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_']
    ]

    const _placeMarker = ({ target: clickedElement }) => {
        const { marker } = GameState.getCurPlayer();
        const [row, col] = clickedElement.dataset.coords.split(' ');
        _board[Number(row)][Number(col)] = clickedElement.textContent =  marker;
        GameState.changeCurPlayer();
    }

    const _repeatAction = (action, times) => {
        for(let i = 0; i < times; i++) {
            action(i);
        }
    }

    const _makeRow = () => {
        return document.createElement('tr');
    }

    const _makeCol = (x, y) => {
        const col = document.createElement('td');
        col.dataset.coords = `${x} ${y}`;
        col.addEventListener('click', _placeMarker, { once: true });
        col.classList = 'square';
        return col;
    }

    const _fillRow = (row, rowNum) => {
        _repeatAction((colNum) => {
            row.append(_makeCol(rowNum, colNum));
        }, 3);
        return row;
    }

    const getBoard = () => [..._board.map(row => [...row])];

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

const Brain = (function() {
    GameBoard.initialize();
})()