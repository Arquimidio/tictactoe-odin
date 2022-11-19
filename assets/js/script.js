const Player = function(name, marker) {
    return {
        name,
        marker
    }
}

const GameBoard = (function(tableElement) {
    const _board = [
        ['_', '_', '_'],
        ['_', '_', '_'],
        ['_', '_', '_']
    ]

    const _placeMarker = ({ target: clickedElement }, marker) => {
        const [row, col] = clickedElement.dataset.coords.split(' ');
        _board[Number(row)][Number[col]] = marker;
    }

    const showBoard = () => {
        for(let i = 0; i < 3; i++) {
            const row = document.createElement('tr');
            for(let j = 0; j < 3; j++) {
                const col = document.createElement('td');
                col.dataset.coords = `${i} ${j}`;
                col.addEventListener('click', _placeMarker, { once: true });
                row.append(col);
            }
            tableElement.append(row);
        }
    }

    return {
        showBoard
    }

})(document.querySelector('table'))

const Brain = (function() {
    GameBoard.showBoard();
})()