export default (function(){
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