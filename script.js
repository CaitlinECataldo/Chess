document.addEventListener("DOMContentLoaded", function() {
    let screenHeight = window.innerHeight;

    // The board that contains all chess squares and chessmen
    const chessBoard = document.querySelector(".chessBoard");
    
    // The notations used to identify square location
    const notationLetters = ["a", "b", "c", "d", "e", "f", "g", "h"]
    const notationNumbers = [8, 7, 6, 5, 4, 3, 2, 1]
    
    // An object containing all chess piece names, starting positions and images
    const allPieces = {
        white: {
                K: {
                    name: "King",
                    image: "/chess_pieces/white-king.png",
                    startingPosition: ["e1"],
                    currentPosition: [],
                    moveTo: []
                },
                Q: {
                    name: "Queen",
                    image: "/chess_pieces/white-queen.png",
                    startingPosition: ["d1"],
                    currentPosition: [],
                    moveTo: []
                },
                R: {
                    name: "Rook",
                    image: "/chess_pieces/white-rook.png",
                    startingPosition: ["a1", "h1"],
                    currentPosition: [],
                    moveTo: []
                    },
                N: {
                    name: "Knight",
                    image: "/chess_pieces/white-knight.png",
                    startingPosition: ["b1", "g1"],
                    currentPosition: [],
                    moveTo: []
                    },
                B: {
                    name: "Bishop",
                    image: "/chess_pieces/white-bishop.png",
                    startingPosition: ["c1", "f1"],
                    currentPosition: [],
                    moveTo: []
                    },
                P: {
                    name: "Pawn",
                    image: "/chess_pieces/white-pawn.png",
                    startingPosition: ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
                    currentPosition: [],
                    moveTo: []
                }
        },
        black: {
            K: {
                name: "King",
                image: "/chess_pieces/black-king.png",
                startingPosition: ["e8"],
                currentPosition: [],
                moveTo: []
            },
            Q: {
                name: "Queen",
                image: "/chess_pieces/black-queen.png",
                startingPosition: ["d8"],
                currentPosition: [],
                moveTo: []
            },
            R: {
                name: "Rook",
                image: "/chess_pieces/black-rook.png",
                startingPosition: ["a8", "h8"],
                currentPosition: [],
                moveTo: []
                },
            N: {
                name: "Knight",
                image: "/chess_pieces/black-knight.png",
                startingPosition: ["b8", "g8"],
                currentPosition: [],
                moveTo: []
                },
            B: {
                name: "Bishop",
                image: "/chess_pieces/black-bishop.png",
                startingPosition: ["c8", "f8"],
                currentPosition: [],
                moveTo: []
                },
            P: {
                name: "Pawn",
                image: "/chess_pieces/black-pawn.png",
                startingPosition: ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
                currentPosition: [],
                moveTo: []
            }
    }
    }

    // An array containing the abreviations for all chessmen
    const chessmen = {
        K: {
            
        }, 
        Q: {

        }, 
        R: {

        }, 
        N: {

        }, 
        B: {

        }, 
        P: {}
    }
    
    // Appends the current move to the gameRecord and returns an index of all moves within the current game
    const gameRecord = []
    
    if (!chessBoard) {
        console.error("No element with class 'chessBoard' found.");
    } else {
        
        function createChessBoard() {
            let allSquares = "";
    
            // assigns a color to a square based on the color of the square in the previous column
            function assignSquare(row, column, notation) {
                const color = (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0) ? "white" : "tan";
                const square = `<div class="${color}Square square" data-notation="${notation}" > </div>`;
                allSquares += square;
            }
    
    
            for (let i = 0; i < 8; i++) {
                const row = i;
                const notationNumber = notationNumbers[i];
                for (let j = 0; j < 8; j++) {
                    const column = j;  
                    const notationLetter = notationLetters[j];
                    const notation = notationLetter + notationNumber;
                    assignSquare(row, column, notation); 
               }                     
            }
            chessBoard.innerHTML = allSquares;
        }
    
        // Populate all black and white chessmen in their starting positions
        function spawnChessmen() {
            for (let color in allPieces) {
                
                for (let piece in allPieces[color]) {
                    const image = allPieces[color][piece].image;
                    const positions = allPieces[color][piece].startingPosition;
                    
                    for (let i = 0; i < positions.length; i++) {
                    // select the square for the chess piece position
                    let square = document.querySelector(`[data-notation="${positions[i]}"]`);
                    square.innerHTML = `<img class="chessman" src="${image}" piece="${piece}" past-moves=0 color="${color}"  >`;
                    }
                }
            }
    
            // Make all chessmen dragable
            const chessman = document.querySelectorAll(".chessman");
            chessman.forEach(piece => {
                piece.setAttribute("draggable", true);
                        
            }); 
        }
    
        createChessBoard();
        spawnChessmen();
    
        
       
            // Variables for event listeners
            let pieces = document.querySelectorAll(".chessman");
    
            
            // Spawn this function for the player who's turn it is whenever they click on a chess piece
            function movePiece(event) {
                let dataNotation = event.target.parentElement.getAttribute("data-notation");
                let clickedPiece = event.target.getAttribute("piece");
                let pastMoves = parseInt(event.target.getAttribute("past-moves"));
                let notation = `${clickedPiece}${dataNotation}`;
                let pieceColor = event.target.getAttribute("color");
                let possibleMoves = allPieces[pieceColor].P.moveTo;
                let row = parseInt(dataNotation[1]);
                let column = dataNotation[0];
                let moveTo = []
                
                // Remove the "P" for pawn to match formal notation
                clickedPiece === "P" ? pieceAbr = "" : pieceAbr = clickedPiece;    
                
                if (clickedPiece != "P") {

                } else {
                    if (pastMoves > 0 && clickedPiece === "P") {
                    } else if (pastMoves === 0 && clickedPiece === "P") {
                        moveTo.push(`${column}${row+2}`,`${column}${row+1}`);
                        possibleMoves.push(moveTo);
                        console.log("pawn clicked and first move to", moveTo);
                    }
                    
                } 

                // Remove all available move colored spots
                document.querySelectorAll(".available").forEach(element => {
                    element.classList.remove('available');
                });

                // Show where the clicked piece can move
                    for (let i = 0; i < moveTo.length; i++) {
                        console.log("moveTo[i]: ", document.querySelector(`[data-notation="${moveTo[i]}"]`));
                        let targetElement = document.querySelector(`[data-notation="${moveTo[i]}"]`);
                        let newDiv = document.createElement('div');
                        newDiv.classList.add("available");
                        targetElement.appendChild(newDiv);
                    }
            }

    
            // Event Listeners
            pieces.forEach(piece => (piece.addEventListener('click', movePiece)));
        
    }
})