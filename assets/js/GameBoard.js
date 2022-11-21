// Game Board module to keep information about the game board
export default (function(tableElement) {

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

    // Chunks an array based on the given size of the chunks
    const _chunk = (arr, size) => {
        if(arr.length <= size) return [arr];
        const cur = arr.slice(0, size);
        const rest = _chunk(arr.slice(size), size);
        return [cur, ...rest];
    }

    // Returns one copy of the boards in its current state
    const getBoard = () => [..._board.map(row => [...row])]

    // Returns a flat copy of the DOM Board
    const getDOMBoard = () => [...document.querySelectorAll('.square')];

    // Returns a Tic Tac Toe Chunked copy of the DOM Board
    const getChunkedDOMBoard = () => {
        const squareArr = getDOMBoard();
        return _chunk(squareArr, 3)
    }

    // Gets the coordinates from the dataset of the DOMSquare
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

    // Verifies if a specific square is marked in the _board
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

    // Highlights the winner sequence
    const highlightSquares = (squares, coords) => {
        coords.forEach(([x, y]) => {
            (squares[x][y]).classList.add('highlight')
        })
    }

    // Reset all the squares of the _board, removing the marks
    const _resetSquares = () => {
        _board.forEach((row, i) => {
            row.forEach((col, j) => _board[i][j] = '');
        })
    }

    // Reset all the squares of the DOMBoard, removing the marks and the highlights-
    const _resetDOMSquares = () => {
        const renderedBoard = getDOMBoard();
        renderedBoard.forEach(square => {
            square.classList.remove('highlight');
            square.textContent = '';
        })
    }

    // Resets both boards
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