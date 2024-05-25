let screenHeight = window.innerHeight;
let chessBoard = document.querySelector(".chessBoard");
const notationLetters = ["a", "b", "c", "d", "e", "f", "g", "h"]
const notationNumbers = [8, 7, 6, 5, 4, 3, 2, 1]

if (!chessBoard) {
    console.error("No element with class 'chessBoard' found.");
} else {
    
    function createChessBoard() {
        let allSquares = "";

        // assigns a color to a square based on the color of the square in the previous column
        function assignSquare(row, column, notation) {
            let color = (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0) ? "white" : "tan";

            let square = `<div class="${color}Square square" notation-value="${notation}"> </div>`;
            allSquares += square;
        }

        // the first color of the first row
        let color = "white";

        for (let i = 0; i < 8; i++) {
            let row = i;
            let notationNumber = notationNumbers[i];
            for (let j = 0; j < 8; j++) {
                let column = j;  
                let notationLetter = notationLetters[j];
                let notation = notationLetter + notationNumber;
                assignSquare(row, column, notation); 
                console.log("notationLetter: ", notationLetter);
           console.log("notationNumber: ", notationNumber);
           }                     
        }
        chessBoard.innerHTML = allSquares;
    }
    createChessBoard();
}