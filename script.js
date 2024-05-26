
class ChessBoard {
    constructor() {
        this.boardElement = document.querySelector(".chessBoard");
        this.notationLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
        this.notationNumbers = [8, 7, 6, 5, 4, 3, 2, 1];
        this.createBoard();
    }

    createBoard() {
        let allSquares = "";

        for (let i = 0; i < 8; i++) {
            const row = i;
            const notationNumber = this.notationNumbers[i];
            for (let j = 0; j < 8; j++) {
                const column = j;
                const notationLetter = this.notationLetters[j];
                const notation = notationLetter + notationNumber;
                const color = (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0) ? "white" : "tan";
                const square = `<div class="${color}Square square" data-notation="${notation}"> </div>`;
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

    highlightMoves(moves) {
        moves.forEach(move => {
            const square = document.querySelector(`[data-notation="${move}"]`);
            const newDiv = document.createElement('div');
            newDiv.classList.add("available");
            square.appendChild(newDiv);
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
            this.board.clearHighlights();
            const moves = piece.getAvailableMoves(this.board);
            this.board.highlightMoves(moves);
        }
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
    }

    getAvailableMoves(board) {
        // To be implemented in subclasses
        return [];
    }
}

class Pawn extends ChessPiece {
    constructor(color, position) {
        super('Pawn', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let movesObject = {};
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
            
            // Remove all of the squares from move[] that are not available (based on attribute)
            moves.forEach(move => {
                
            });
            return moves;
        }
    }

class King extends ChessPiece {
    constructor(color, position) {
        super('King', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];

        
        // This shows where the piece can move on the board
    
            return moves;
        }
    }

class Queen extends ChessPiece {
    constructor(color, position) {
        super('Queen', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];

        
        // This shows where the piece can move on the board
    
            return moves;
        }
    }

class Rook extends ChessPiece {
    constructor(color, position) {
        super('Rook', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];

        
        // This shows where the piece can move on the board
    
            return moves;
        }
    }

class Bishop extends ChessPiece {
    constructor(color, position) {
        super('Bishop', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];

        
        // This shows where the piece can move on the board
        console.log("moves", moves);
            return moves;
        }
    }

class Knight extends ChessPiece {
    constructor(color, position) {
        super('Knight', color, position)
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = this.position[0];

        
        // This shows where the piece can move on the board
    
            return moves;
        }
    }



// Initialize the game
document.addEventListener("DOMContentLoaded", function() {
new ChessGame();
});
