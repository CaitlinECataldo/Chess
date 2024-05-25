let screenHeight = window.innerHeight;
let chessBoard = document.querySelector(".chessBoard");

if (!chessBoard) {
    console.error("No element with class 'chessBoard' found.");
} else {
    
    function createChessBoard() {
        let allSquares = "";

        // assigns a color to a square based on the color of the square in the previous column
        function assignSquare(index) {
            let color = (index % 2 === 0 && Math.ceil(index / 8) % 2 === 0) || (index % 2 !== 0 && Math.ceil(index / 8) % 2 !== 0) ? "tan" : "white";
            let square = `<div class="${color}Square"> </div>`;
            allSquares += square;
        }

        // the first color of the first row
        let color = "white";

        for (let i = 1; i <= 64; i++) {
           assignSquare(i);
        }
        chessBoard.innerHTML = allSquares;
    }
    createChessBoard();
}