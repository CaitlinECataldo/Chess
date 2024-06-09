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
                const isLabel = (row === 0 || column === 0) ? true : false
                const color = (row % 2 === 0 && column % 2 === 0) || (row % 2 !== 0 && column % 2 !== 0) || isLabel ? "white" : "tan";
                let square = "";

                if (isLabel && row < 9 && column < 9) {
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
        if (moves.length > 0) {

            moves.forEach(move => {
                const square = document.querySelector(`[data-notation="${move}"]`);
                const occupyingPieces = square.querySelector('.chessman');
                let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            
                if ( !occupyingPieces || color !== occupyingColor) {
                    const newDiv = document.createElement('div');
                    newDiv.classList.add("available");
                    square.appendChild(newDiv);
                }
                
            });
        }

    }
}

class ChessGame {

    constructor() {
    this.board = new ChessBoard();
    this.pieces = this.createPieces();
    this.board.createBoard(); // Add this line to create the board
    this.renderPieces(); // Add this line to render the pieces on the board
    this.addEventListeners();
    this.promotePawn;
    this.blackScore = 0;
    this.whiteScore = 0;
    this.rooks = this.pieces.filter(piece => piece instanceof Rook) // Filter out only the Rooks
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
            pieceElement.setAttribute("value", piece.value);
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
        const isPromotion = event.target.parentElement.className === "promotionGrid" ? true : false;
        let promotionReturn = [];

        if (isPromotion) {
            promotionReturn.push(event.target.getAttribute("piece"));
            promotionReturn.push(parseFloat(event.target.getAttribute("value")));
            return promotionReturn;
        }
        
        // Find the corresponding piece object
        const piece = this.pieces.find(p => p.type === pieceType && p.color === pieceColor && p.position === piecePosition);
        
        if (piece) {

            this.board.clearHighlights();
            const moves = piece.getAvailableMoves(this.board);
            if (piece.type === "King") {
                let addMoves = this.castleKing(piece);
                if (addMoves) {
                    addMoves.forEach(move => {
                        moves.push(move)
                    })
                }
            }
            this.board.highlightMoves(moves, piece.color);
            moves.forEach(move => {
                const targetSquare = document.querySelector(`[data-notation="${move}"] .available`);
                if (targetSquare) {
                    targetSquare.addEventListener('click', () => this.movePiece(piece, move));
                }
            });

        }

        

    
    }


    castleKing(piece) {
        let addMoves = piece.castle()
        let rooksAvailable = false;

        console.log("castleLaneAvailable: ", piece.castleLaneAvailable);
        console.log("past moves",piece.pastMoves);
        
        // Access the pastMoves of the rooks
        this.rooks.forEach(rook => {
        if (rook.color === piece.color && rook.pastMoves === 0) {
            rooksAvailable = true;
            console.log("rook past moves: ", rook.pastMoves);
        }
        })

        if (piece.type === "King" && piece.castleLaneAvailable === true && piece.pastMoves === 0 && rooksAvailable) {
            console.log("The king may castle");
            console.log("addMoves: ",addMoves);
            return addMoves
        }
    }


    movePiece(piece, newPosition) {
        const color = piece.color;
        
        // Find the square where the piece was moved to
        const newSquare = document.querySelector(`[data-notation="${newPosition}"]`);
        const rival = newSquare.querySelector(".chessman");
        let rivalColor = null;       

        if (rival) {
            rivalColor = rival.getAttribute("color");
           
           if (rivalColor !== piece.color) {
            const grave = document.querySelector(`.deadPieces`).querySelector(`.${rivalColor}`);
            const rivalValue = parseFloat(rival.getAttribute("value"));
           grave.appendChild(rival)
           console.log(`You just won ${rivalValue} points!`);

         
         if (piece.color === "black") {
            this.blackScore += rivalValue;
            document.querySelector(`.black`).querySelector(".score").innerHTML = this.blackScore;
         } else if (piece.color === "white") {
            this.whiteScore += rivalValue;
            document.querySelector(`.white`).querySelector(".score").innerHTML = this.whiteScore;
         }
        }
        }

        // Promote pawn when it gets to the final row opposite from starting position
        if (piece.type === "Pawn") {
            if (piece.color === "white" && parseFloat(parseFloat(newPosition[1])) === 8 || piece.color === "black" && (parseFloat(newPosition[1])) === 1) {
                let promoteOptions = 
                `
                <div class="promotion">
                    <h3 style="grid-row: 1; grid-column: 2; justify-content: center; display: flex">Promote your pawn</h3>
                    <div class="promotionGrid">
                        <img class="chessman" src="/chess_pieces/${piece.color}-queen.png" piece="Queen" color="${piece.color}" draggable="true" value="9">
                        <img class="chessman" src="/chess_pieces/${piece.color}-rook.png" piece="Rook" color="${piece.color}" draggable="true" value="5">
                        <img class="chessman" src="/chess_pieces/${piece.color}-knight.png" piece="Knight" color="${piece.color}" draggable="true" value="3">
                        <img class="chessman" src="/chess_pieces/${piece.color}-bishop.png" piece="Bishop" color="${piece.color}" draggable="true" value="3">
                    </div>
                </div>
                `

                const promoPieces = document.querySelector(".promoPieces");
                promoPieces.innerHTML = promoteOptions;

                // add click event to promotion piece options
                const chessmen = promoPieces.querySelectorAll(".chessman");
                let selectedPiece = "";
                let pieceValue = "";

                const handleSelectedPiece = (piece) => {
                    selectedPiece = piece[0];
                    pieceValue = piece[1]

                    // Find the index of the promoted pawn in the pieces array
                    const index = this.pieces.findIndex(piece => piece.type === 'Pawn' && piece.color === color && piece.position === newPosition);
                    // If the index is found, remove the promoted pawn from the array
                    if (index !== -1) {
                        this.pieces.splice(index, 1);
                    }


                // Update pawn to selected piece
               newSquare.innerHTML = `<img class="chessman" src="/chess_pieces/${color}-${selectedPiece.toLowerCase()}.png" piece="${selectedPiece}" color="${color}" draggable="true" value="${pieceValue}">`;
               let newPiece;
                switch (selectedPiece) {
                    case 'Pawn':
                        newPiece = new Pawn(color, newPosition);
                        break;
                    case 'Rook':
                        newPiece = new Rook(color, newPosition);
                        break;
                    case 'Knight':
                        newPiece = new Knight(color, newPosition);
                        break;
                    case 'Bishop':
                        newPiece = new Bishop(color, newPosition);
                        break;
                    case 'Queen':
                        newPiece = new Queen(color, newPosition);
                        break;
                    case 'King':
                        newPiece = new King(color, newPosition);
                        break;
                    default:
                        // Handle the case where selectedPiece is not recognized
                }
                this.pieces.push(newPiece);


                // Add an event listener to the new piece
                newSquare.querySelector(".chessman").addEventListener('click', (event) => {
                    this.handlePieceClick(event);
                })

                    // Add the points for the promotion to the player's scoreboard
                    if (color === "white") {
                        this.whiteScore += parseFloat(pieceValue);
                        document.querySelector(`.white`).querySelector(".score").innerHTML = this.whiteScore;

                    } else if (color === "black") {
                        this.blackScore += parseFloat(pieceValue);
                        document.querySelector(`.black`).querySelector(".score").innerHTML = this.blackScore;
                    }



                };
                
                chessmen.forEach( chessman => {
                    chessman.addEventListener('click', (event) => {
                        const piece = this.handlePieceClick(event);
                        if (piece) {
                            handleSelectedPiece(piece);
                        } })
                });
   


        }
    }

        // Remove the piece from its old square
        const oldSquare = document.querySelector(`[data-notation="${piece.position}"]`);
        const pieceElement = oldSquare.querySelector('.chessman');
        oldSquare.removeChild(pieceElement);
        newSquare.appendChild(pieceElement);

        // Update the position of the piece
        piece.position = newPosition;

        // Clear the space move highlights from the board
        this.board.clearHighlights()

        // Ensure the piece remains draggable and clickable
        pieceElement.setAttribute("draggable", true);

        // Update the number of past moves within the subclass of the piece moved
        piece.addMove();      
       
    }
    
}

class ChessPiece {
    constructor(type, color, position, value, pastMoves = 0) {
        this.type = type;
        this.color = color;
        this.position = position;
        this.value = value;
        this.pastMoves = pastMoves;
 
    }

    move(newPosition) {

        this.position = newPosition;
        this.render();
    }

    // This function records how many times the piece has moved. It is called from the ChessPiece.movePiece() function.
    addMove() {
        this.pastMoves += 1;
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
    }

    getAvailableMoves(board) {
        // To be implemented in subclasses
        return [];
    }


    
}

class Pawn extends ChessPiece {
    constructor(color, position) {
        super('Pawn', color, position);
        this.value = 1;
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        let targetLocation = "";

        if (this.color === 'white') {
            if (row === 2) {
                moves.push([column, row + 1]);
                moves.push([column, row + 2]);
            } else {
                moves.push([column, row + 1]);
            }
        } else {
            if (row === 7) {
                moves.push([column, row - 1]);
                moves.push([column, row - 2]);
            } else {
                moves.push([column, row - 1]);
            }
        }

        moves = moves.filter(move => {
            let newColumn = move[0];
            let newRow = move[1];
            return newRow > 0 && newRow <= 8 && newColumn > 0 && newColumn <= 8;
        });

                // Filter out moves that have a piece in front
                moves = moves.filter(move => {
                    let newColumn = move[0];
                    let newRow = move[1];
                    let availableSpace = convertNotation(newColumn, newRow);
                    const square = document.querySelector(`[data-notation="${availableSpace}"]`);
                    const occupyingPieces = square.querySelector('.chessman');
                    return occupyingPieces === null;
                });

                // Check and include diagonal captures
    let leftDiagonal = this.color === 'white' ? [column - 1, row + 1] : [column - 1, row - 1];
    let rightDiagonal = this.color === 'white' ? [column + 1, row + 1] : [column + 1, row - 1];

    // Include left diagonal if it's a valid capture
    if (leftDiagonal[0] > 0 && leftDiagonal[0] <= 8) {
        let availableSpace = convertNotation(leftDiagonal[0], leftDiagonal[1]);
        const square = document.querySelector(`[data-notation="${availableSpace}"]`);
        const occupyingPieces = square.querySelector('.chessman');
        if (occupyingPieces && occupyingPieces.getAttribute('color') !== this.color) {
            moves.push(leftDiagonal);
        }
    }

    // Include right diagonal if it's a valid capture
    if (rightDiagonal[0] > 0 && rightDiagonal[0] <= 8) {
        let availableSpace = convertNotation(rightDiagonal[0], rightDiagonal[1]);
        const square = document.querySelector(`[data-notation="${availableSpace}"]`);
        const occupyingPieces = square.querySelector('.chessman');
        if (occupyingPieces && occupyingPieces.getAttribute('color') !== this.color) {
            moves.push(rightDiagonal);
        }
    }

        return moves.map(move => convertNotation(move[0], move[1]));
    }
}

class King extends ChessPiece {
    constructor(color, position, pastMoves) {
        super('King', color, position, pastMoves);
        this.value = null;
        this.castleLaneLeft = [];
        this.castleLaneRight = [];
        this.castleLaneAvailable = false;
        this.leftCastleSquares = true;
        this.rightCastleSquares = true;
        
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
                bottomRight: `${column+1}${row-1}`,
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
                let newColumn = parseFloat(move[0]);
                let newRow = move[1];
                return newRow > 0 && newRow <= 8 && newColumn > 0 && newColumn <= 8;
            })

            let newMoves = [];
            moves.forEach(move => {
                newMoves.push(convertNotation(parseFloat(move[0]), parseFloat(move[1])));
            })

            moves = newMoves;
            
            return moves;

        }

        castle() {
            let addMoves = [];
            // Add the squares required to be available to the castleLane array for the corresponding color
        if ( this.color === "white") {
            this.castleLaneLeft.push('b1');
            this.castleLaneLeft.push('c1');
            this.castleLaneLeft.push('d1');
            this.castleLaneRight.push('f1');
            this.castleLaneRight.push('g1');
        } else if (this.color === "black") {
            this.castleLaneLeft.push('b8');
            this.castleLaneLeft.push('c8');
            this.castleLaneLeft.push('d8');
            this.castleLaneRight.push('f8');
            this.castleLaneRight.push('g8');
        }

        // Check to see if all left castleLane squares are available
        this.castleLaneLeft.forEach(square => {
            let squareInfo = document.querySelector(`[data-notation="${square}"]`).querySelector('.chessman');
            if (squareInfo) {this.leftCastleSquares = false}
        })

        // Check to see if all right castleLane squares are available
        this.castleLaneRight.forEach(square => {
            let squareInfo = document.querySelector(`[data-notation="${square}"]`).querySelector('.chessman');
            if (squareInfo) {this.rightCastleSquares = false}
        })


        // If either of the castle side squares are open, set castleLaneAvailable to true
        if (this.leftCastleSquares || this.rightCastleSquares) {
            this.castleLaneAvailable = true;
        }


        if (this.leftCastleSquares) {
            if (this.color === "white") {
                addMoves.push('c1');
            } else if (this.color === "black") {
                addMoves.push('c8')
            }
        }
        if (this.rightCastleSquares) {
            if (this.color === "white") {
                addMoves.push('g1');
            } else if (this.color === "black") {
                addMoves.push('g8')
            }
        }

        // Reset the castleLane arrays and statuses
        this.castleLaneLeft = [];
        this.castleLaneRight = [];
        this.leftCastleSquares = true;
        this.rightCastleSquares = true;

        return addMoves;
        }
    


    }

class Queen extends ChessPiece {
    constructor(color, position) {
        super('Queen', color, position);
        this.value = 9;
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        

            // Move top-right
        for (let i = column + 1, newRow = row + 1 ; i <= 8 && newRow <= 8; i++, newRow++) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }

        // Move top-left
        for (let i = column - 1, newRow = row + 1; i >= 1 && newRow <= 8  ; i--, newRow++) {
                       let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }  
        }


        // Move bottom-left
        for (let i = column - 1, newRow = row - 1; i >= 1 && newRow >= 1; i--, newRow--) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }  
        } 

        // Move bottom-right
        for (let i = column + 1, newRow = row - 1; i <= 8 && newRow >= 1; i++, newRow--) {

            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }  
        }   
        
        // Move forwards
        for (let i = row+1; i <= 8; i++) {
            let color = this.color;
            let newRow = i;
            let availableSpace = convertNotation(column, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }  
        }
    
        // Move backwards
        for (let i = row-1; i > 0; i--) {
            let color = this.color;
            let newRow = i;
            let availableSpace = convertNotation(column, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }  
        }

         // Move right
        for (let i = column + 1, newRow = row; i <= 8; i++) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }

        // Move left
        for (let i = column - 1, newRow = row; i >= 1 && newRow <= 8  ; i--) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }

        return moves;
        }


    }

class Rook extends ChessPiece {
    constructor(color, position) {
        super('Rook', color, position);
        this.value = 5;
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);


    // Move forwards
    for (let i = row+1; i <= 8; i++) {
        let color = this.color;
        let newRow = i;
        let availableSpace = convertNotation(column, newRow);

        const square = document.querySelector(`[data-notation="${availableSpace}"]`);

        const occupyingPieces = square.querySelector('.chessman');
        let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
        if (occupyingColor === this.color) break;
        if (color !== occupyingColor && !occupyingPieces ) {
            moves.push(availableSpace);
        } else if (color !== occupyingColor && occupyingPieces) {
            moves.push(availableSpace);
            break;
        }      
    }

    // Move backwards
    for (let i = row-1; i > 0; i--) {
        let color = this.color;
        let newRow = i;
        let availableSpace = convertNotation(column, newRow);

        const square = document.querySelector(`[data-notation="${availableSpace}"]`);

        const occupyingPieces = square.querySelector('.chessman');
        let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
        if (occupyingColor === this.color) break;
        if (color !== occupyingColor && !occupyingPieces ) {
            moves.push(availableSpace);
        } else if (color !== occupyingColor && occupyingPieces) {
            moves.push(availableSpace);
            break;
        }      
    }

     // Move right
    for (let i = column + 1, newRow = row; i <= 8; i++) {
        let color = this.color;
        let availableSpace = convertNotation(i, newRow);

        const square = document.querySelector(`[data-notation="${availableSpace}"]`);

        const occupyingPieces = square.querySelector('.chessman');
        let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
        if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }              
    }

    // Move left
    for (let i = column - 1, newRow = row; i >= 1 && newRow <= 8  ; i--) {
        let color = this.color;
        let availableSpace = convertNotation(i, newRow);

        const square = document.querySelector(`[data-notation="${availableSpace}"]`);

        const occupyingPieces = square.querySelector('.chessman');
        let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
        
        if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
    }
        return moves;
        }


    }

class Bishop extends ChessPiece {
    constructor(color, position) {
        super('Bishop', color, position);
        this.value = 3;
    }

    getAvailableMoves(board) {
        let moves = [];
        let row =  parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);
        

                    // Move top-right
        for (let i = column + 1, newRow = row + 1 ; i <= 8 && newRow <= 8; i++, newRow++) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }

        // Move top-left
        for (let i = column - 1, newRow = row + 1; i >= 1 && newRow <= 8  ; i--, newRow++) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }


        // Move bottom-left
        for (let i = column - 1, newRow = row - 1; i >= 1 && newRow >= 1; i--, newRow--) {
            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        } 

        // Move bottom-right
        for (let i = column + 1, newRow = row - 1; i <= 8 && newRow >= 1; i++, newRow--) {

            let color = this.color;
            let availableSpace = convertNotation(i, newRow);

            const square = document.querySelector(`[data-notation="${availableSpace}"]`);

            const occupyingPieces = square.querySelector('.chessman');
            let occupyingColor = occupyingPieces ? occupyingPieces.getAttribute('color') : null;
            if (occupyingColor === this.color) break;
            if (color !== occupyingColor && !occupyingPieces ) {
                moves.push(availableSpace);
            } else if (color !== occupyingColor && occupyingPieces) {
                moves.push(availableSpace);
                break;
            }      
        }  


        return moves;
        }



    }

class Knight extends ChessPiece {
    constructor(color, position) {
        super('Knight', color, position);
        this.value = 3;
    }

    getAvailableMoves(board) {
        let moves = [];
        let row = parseInt(this.position[1]);
        let column = convertPosition(this.position[0]);

        const offsets = [
            [-2, -1], [-2, 1], [2, -1], [2, 1],
            [-1, -2], [-1, 2], [1, -2], [1, 2]
        ];

        for (let offset of offsets) {
            let newColumn = column + offset[0];
            let newRow = row + offset[1];

            if (newRow >= 1 && newRow <= 8 && newColumn >= 1 && newColumn <= 8) {
                moves.push(convertNotation(newColumn, newRow));
            }
        }

        return moves;
    }
}


// Initialize the game
document.addEventListener("DOMContentLoaded", function() {
new ChessGame();
});
