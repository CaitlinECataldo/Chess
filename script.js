function convertPosition(input) {
    let convertTo = typeof input === "string" ? "number" : "letter";
    if (convertTo !== 'letter' && convertTo !== 'number') {
        throw new Error("Invalid conversion type. Please specify 'letter' or 'number'.");
    }

    if (convertTo === 'letter') {
        if (!Number.isInteger(input) || input < 1 || input > 8) {
            throw new Error("Invalid number. Please enter a number between 1 and 8.");
        }
        return String.fromCharCode('a'.charCodeAt(0) + input - 1);
    }

    if (convertTo === 'number') {
        if (input.length !== 1 || !/^[a-h]$/i.test(input)) {
            throw new Error("Invalid letter. Please enter a letter between 'a' and 'h'.");
        }
        return input.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
    }
}

function convertNotation(column, row) {
    
    let letterNotation = convertPosition(column);
    return `${letterNotation}${row}`;
}


class ChessBoard {
    constructor() {
        this.boardElement = document.querySelector(".chessBoard");
        this.notationLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
        this.notationNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
        this.createBoard();
    }

    createBoard() {
        let allSquares = "";

        for (let i = 0; i < 9; i++) {
            const row = i;
            const notationNumber = this.notationNumbers[i-1];
            const labelNumber = this.notationNumbers[i];
            for (let j = 0; j < 9; j++) {
                const column = j;
                const notationLetter = this.notationLetters[j-1];
                const labelLetter = this.notationLetters[j];
                const notation = notationLetter + notationNumber;
                const label = (row === 0 || column === 0) ? true : false
                const color = (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0) || label ? "white" : "tan";
                let square = "";

                if (label && row < 9 && column < 9) {
                    if (row === 0 && column >= 1) {
                        square = `<div class="columnLabel" row="${row}" column="${column}">${notationLetter}</div>`;
                    } else if (column === 0 && row >= 1) {
                        square = `<div class="rowLabel" row="${row}" column="${column}">${notationNumber}</div>`;
                    } else {
                        square = `<div class="label" row="${row}" column="${column}"></div>`;
                    }
                } else if( row > 0 && column > 0) {
                    square = `<div class="${color}Square square" row="${row}" column="${column}" data-notation="${notation}"> </div>`;
                }
                
                allSquares += square;                
            }
        }
        this.boardElement.innerHTML = allSquares;
    }

    clearHighlights() {
        document.querySelectorAll(".available").forEach(element => {
            element.classList.remove('available');
        });
    }

    highlightMoves(moves, color) {
        let blocked = false;
        
        moves.forEach(move => {
            const square = document.querySelector(`[data-notation="${move}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            
            if (occupyingPieces) {blocked = true}
            if (color !== occupyingColor && !blocked ) {
                const newDiv = document.createElement('div');
                newDiv.classList.add("available");
                square.appendChild(newDiv);
            }
        });
    }
}

class ChessGame {

    constructor() {
    this.board = new ChessBoard();
    this.pieces = this.createPieces();
    this.board.createBoard(); // Add this line to create the board
    this.renderPieces(); // Add this line to render the pieces on the board
    this.addEventListeners();
    }


    createPieces() {
    let pieces = [];
    // Initialize pieces for both colors
    pieces.push(new Pawn('white', 'a2'));
    pieces.push(new Pawn('white', 'b2'));
    pieces.push(new Pawn('white', 'c2'));
    pieces.push(new Pawn('white', 'd2'));
    pieces.push(new Pawn('white', 'e2'));
    pieces.push(new Pawn('white', 'f2'));
    pieces.push(new Pawn('white', 'g2'));
    pieces.push(new Pawn('white', 'h2'));
    pieces.push(new Pawn('black', 'a7'));
    pieces.push(new Pawn('black', 'b7'));
    pieces.push(new Pawn('black', 'c7'));
    pieces.push(new Pawn('black', 'd7'));
    pieces.push(new Pawn('black', 'e7'));
    pieces.push(new Pawn('black', 'f7'));
    pieces.push(new Pawn('black', 'g7'));
    pieces.push(new Pawn('black', 'h7'));

    
    // Kings
    pieces.push(new King('white', 'e1'));
    pieces.push(new King('black', 'e8'));

    // Queens
    pieces.push(new Queen('white', 'd1'));
    pieces.push(new Queen('black', 'd8'));

    // Rooks
    pieces.push(new Rook('white', 'a1'));
    pieces.push(new Rook('white', 'h1'));
    pieces.push(new Rook('black', 'a8'));
    pieces.push(new Rook('black', 'h8'));

    // Knights
    pieces.push(new Knight('white', 'b1'));
    pieces.push(new Knight('white', 'g1'));
    pieces.push(new Knight('black', 'b8'));
    pieces.push(new Knight('black', 'g8'));

    // Bishops
    pieces.push(new Bishop('white', 'c1'));
    pieces.push(new Bishop('white', 'f1'));
    pieces.push(new Bishop('black', 'c8'));
    pieces.push(new Bishop('black', 'f8'));

    return pieces;
    }

    renderPieces() {
        this.pieces.forEach(piece => {
            const square = document.querySelector(`[data-notation="${piece.position}"]`);
            const pieceElement = document.createElement('img');
            pieceElement.classList.add("chessman");
            pieceElement.setAttribute("src", `/chess_pieces/${piece.color}-${piece.type.toLowerCase()}.png`);
            pieceElement.setAttribute("piece", piece.type);
            pieceElement.setAttribute("color", piece.color);
            pieceElement.setAttribute("draggable", true);
            square.appendChild(pieceElement);
        });
    }


    
    addEventListeners() {
        document.querySelectorAll(".chessman").forEach(pieceElement => {
            pieceElement.addEventListener('click', (event) => this.handlePieceClick(event));
        });     

    }



    
    handlePieceClick(event) {
        const pieceElement = event.target;
        const pieceType = pieceElement.getAttribute("piece");
        const pieceColor = pieceElement.getAttribute("color");
        const piecePosition = pieceElement.parentElement.getAttribute("data-notation");
        
        console.log("piece clicked");
        // Find the corresponding piece object
        const piece = this.pieces.find(p => p.type === pieceType && p.color === pieceColor && p.position === piecePosition);
        
        if (piece) {
            let position1 = piecePosition;
            this.board.clearHighlights();
            console.log("cleared highlights");
            const moves = piece.getAvailableMoves(this.board);
            console.log("getting moves");
            this.board.highlightMoves(moves, piece.color);
            console.log("highlighting moves");
            moves.forEach(move => {
                const targetSquare = document.querySelector(`[data-notation="${move}"] .available`);
                if (targetSquare) {
                    targetSquare.addEventListener('click', () => this.movePiece(piece, move));
                }
            });
 
        }

        

    
    }

    movePiece(piece, newPosition) {
        // Find the square where the piece was moved to
        const newSquare = document.querySelector(`[data-notation="${newPosition}"]`);

        // Remove the piece from its old square
        const oldSquare = document.querySelector(`[data-notation="${piece.position}"]`);
        const pieceElement = oldSquare.querySelector('.chessman');
        oldSquare.removeChild(pieceElement);

        // Render the piece in its new square
        const newPieceElement = document.createElement('img');
        newPieceElement.classList.add("chessman");
        newPieceElement.setAttribute("src", `/chess_pieces/${piece.color}-${piece.type.toLowerCase()}.png`);
        newPieceElement.setAttribute("piece", piece.type);
        newPieceElement.setAttribute("color", piece.color);
        newPieceElement.setAttribute("draggable", true);
        newSquare.appendChild(newPieceElement);

        // Update the position of the piece
        piece.position = newPosition;

        // Clear the space move highlights from the board
        this.board.clearHighlights(),
        console.log("cleared highlights")

        // Re-add event listeners for the new piece element
        newPieceElement.addEventListener('click', (event) => (this.handlePieceClick(event)));
    }
    
}




class ChessPiece {
    constructor(type, color, position) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.pastMoves = 0;
 
    }

    move(newPosition) {

        this.position = newPosition;
        this.render();
    }



    render() {
        // Find the corresponding square on the board
        const square = document.querySelector(`[data-notation="${this.position}"]`);

        // Clear the square
        square.innerHTML = '';

        // Render the piece on the new square
        const pieceElement = document.createElement('img');
        pieceElement.classList.add("chessman");
        pieceElement.setAttribute("src", `/chess_pieces/${this.color}-${this.type.toLowerCase()}.png`);
        pieceElement.setAttribute("piece", this.type);
        pieceElement.setAttribute("color", this.color);
        pieceElement.setAttribute("draggable", true);
        square.appendChild(pieceElement);
        console.log("piece rendered");
    }

    getAvailableMoves(board) {
        // To be implemented in subclasses
        return [];
    }


    
}

class Pawn extends ChessPiece {
    constructor(color, position) {
        super('Pawn', color, position);


    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];
        let square = "";

        if (this.color === 'white') {
            if (row > 2) {
                square = `${column}${row+1}`,`${column}${row+1}`;
                moves.push(square);
                
            } else {
                moves.push(`${column}${row+1}`,`${column}${row+2}`);
            }
        } else {
            if (row < 7) {
                moves.push(`${column}${row-1}`,`${column}${row-1}`);
            } else {
                moves.push(`${column}${row-1}`,`${column}${row-2}`);
                }
            }
            console.log("moves: ", moves);
            return moves;
        }
    }





class King extends ChessPiece {
    constructor(color, position) {
        super('King', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        
        const directions = {
            white: {
                top: `${column}${row+1}`,
                topRight: `${column+1}${row+1}`,
                topLeft: `${column-1}${row+1}`,
                bottom: `${column}${row-1}`,
                bottomRight: `${column-1}${row-1}`,
                bottomLeft: `${column-1}${row-1}`,
                left: `${column-1}${row}`,
                right: `${column+1}${row}`
            },
            black: {
                top: `${column}${row-1}`,
                topRight: `${column-1}${row-1}`,
                topLeft: `${column+1}${row-1}`,
                bottom: `${column}${row+1}`,
                bottomRight: `${column+1}${row+1}`,
                bottomLeft: `${column+1}${row+1}`,
                left: `${column+1}${row}`,
                right: `${column-1}${row}`
            }
        }
        
        // This shows where the piece can move on the board
            for (let direction in directions[this.color]) {
                moves.push(directions[this.color][direction])
            }

            moves = moves.filter(move => {
                let newColumn = move[0];
                let newRow = move[1];
                return newRow > 0 && newRow <= 8 && newColumn > 0 && newColumn <= 8;
            })
            let newMoves = moves;
            moves = moves.map(move => {
                let newColumn = convertPosition(parseFloat(move[0]));
                let newRow = move[1];
                newMoves.push(`${newColumn}${newRow}`);
                return newMoves;
            })
            moves = [];
            console.log("moves: ", moves);
            return moves;
        }


    }

class Queen extends ChessPiece {
    constructor(color, position) {
        super('Queen', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        

            // Move top-right
        for (let i = column + 1, newRow = row + 1 ; i <= 8 && newRow <= 8; i++, newRow++) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace);
        }

        // Move top-left
        for (let i = column - 1, newRow = row + 1; i >= 1 && newRow <= 8  ; i--, newRow++) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace);
        }


        // Move bottom-left
        for (let i = column - 1, newRow = row - 1; i >= 1 && newRow >= 1; i--, newRow--) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace);
        } 

        // Move bottom-right
        for (let i = column + 1, newRow = row - 1; i <= 8 && newRow >= 1; i++, newRow--) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace);
        
        }   
        
        // Move forwards
        for (let i = row+1; i <= 8; i++) {
            let newRow = i;
            let availableSpace = convertNotation(column, newRow);
            moves.push(availableSpace);
        }
    
        // Move backwards
        for (let i = row-1; i > 0; i--) {
            let newRow = i;
            let availableSpace = convertNotation(column, newRow);
            moves.push(availableSpace);
        }
        console.log("moves: ", moves);
        return moves;
        }


    }

class Rook extends ChessPiece {
    constructor(color, position) {
        super('Rook', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);


            for (let i = row+1; i <= 8; i++) {
                let newRow = i;
                let availableSpace = convertNotation(column, newRow);
                moves.push(availableSpace)
            }
        
            for (let i = row-1; i > 0; i--) {
                let newRow = i;
                let availableSpace = convertNotation(column, newRow);
                moves.push(availableSpace)
            }


            console.log("moves: ", moves);
        return moves;
        }


    }

class Bishop extends ChessPiece {
    constructor(color, position) {
        super('Bishop', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        

            // Move top-right
        for (let i = column + 1, newRow = row + 1 ; i <= 8 && newRow <= 8; i++, newRow++) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace)
        }

        // Move top-left
        for (let i = column - 1, newRow = row + 1; i >= 1 && newRow <= 8  ; i--, newRow++) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace)
        }


        // Move bottom-left
        for (let i = column - 1, newRow = row - 1; i >= 1 && newRow >= 1; i--, newRow--) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace)
        } 

        // Move bottom-right
        for (let i = column + 1, newRow = row - 1; i <= 8 && newRow >= 1; i++, newRow--) {
            let availableSpace = convertNotation(i, newRow);
            moves.push(availableSpace)
        
        }    





        console.log("moves: ", moves);
        return moves;
        }



    }

class Knight extends ChessPiece {
    constructor(color, position) {
        super('Knight', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);

        const directions = {
            white: {
                topRight: `${column+1}${row+2}`,
                topLeft: `${column-1}${row+2}`,
                bottomRight: `${column-2}${row-1}`,
                bottomLeft: `${column-2}${row-1}`,
                leftTop: `${column-2}${row+1}`,
                leftBottom: `${column-2}${row-1}`,
                rightTop: `${column+2}${row+1}`,
                rightBottom: `${column+2}${row-1}`
            },
            black: {
                topRight: `${column-1}${row-2}`,
                topLeft: `${column+1}${row-2}`,
                bottomRight: `${column+2}${row+1}`,
                bottomLeft: `${column+2}${row+1}`,
                leftTop: `${column+2}${row+1}`,
                leftBottom: `${column-2}${row-1}`,
                rightTop: `${column+2}${row-1}`,
                rightBottom: `${column+2}${row-1}`
            }
        }
        

        // This shows where the piece can move on the board
            for (let direction in directions[this.color]) {
                moves.push(directions[this.color][direction])
            }

            moves = moves.filter(move => {
                let newColumn = move[0];
                let newRow = move[1];
                return newRow > 0 && newRow <= 8 && newColumn > 0 && newColumn <= 8;
            })

            moves = moves.map(move => {
                let newColumn = convertPosition(parseFloat(move[0]));
                let newRow = move[1];
                let newMoves = [];
                
                newMoves.push(`${newColumn}${newRow}`);
                return newMoves;
            })
            console.log("moves: ", moves);
            return moves;
        }


    }



// Initialize the game
document.addEventListener("DOMContentLoaded", function() {
new ChessGame();
});
