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

            let square = `<div class="${color}Square square" data-notation="${notation}"> </div>`;
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
           }                     
        }
        chessBoard.innerHTML = allSquares;
    }

    function spawnChessmen() {
        const chessmen = {
            white: {
                    king: {
                        image: "/chess_pieces/white-king.png",
                        startingPosition: ["e1"]
                    },
                    queen: {
                        image: "/chess_pieces/white-queen.png",
                        startingPosition: ["d1"]
                    },
                    rook: {
                        image: "/chess_pieces/white-rook.png",
                        startingPosition: ["a1", "h1"]
                        },
                    knight: {
                        image: "/chess_pieces/white-knight.png",
                        startingPosition: ["b1", "g1"]
                        },
                    bishop: {
                        image: "/chess_pieces/white-bishop.png",
                        startingPosition: ["c1", "f1"]
                        },
                    pawn: {
                        image: "/chess_pieces/white-pawn.png",
                        startingPosition: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"]}
            },
            black: {
                king: {
                    image: "/chess_pieces/black-king.png",
                    startingPosition: ["e8"]
                },
                queen: {
                    image: "/chess_pieces/black-queen.png",
                    startingPosition: ["d8"]
                },
                rook: {
                    image: "/chess_pieces/black-rook.png",
                    startingPosition: ["a8", "h8"]
                    },
                knight: {
                    image: "/chess_pieces/black-knight.png",
                    startingPosition: ["b8", "g8"]
                    },
                bishop: {
                    image: "/chess_pieces/black-bishop.png",
                    startingPosition: ["c8", "f8"]
                    },
                pawn: {
                    image: "/chess_pieces/black-pawn.png",
                    startingPosition: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"]
                }
        }
        }

        for (let color in chessmen) {
            for (let piece in chessmen[color]) {
                let image = chessmen[color][piece].image;
                let positions = chessmen[color][piece].startingPosition;
                
                for (let i = 0; i < positions.length; i++) {
                // select the square for the chess piece position
                let square = document.querySelector(`[data-notation="${positions[i]}"]`);
                square.innerHTML = `<img class="chessmen" src="${image}" >`;
                }
            }
        }
    }

    createChessBoard();
    spawnChessmen();
}