import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Piece } from "@chessire/pieces";

const App = () => {
  const initialFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

  const parseFEN = (fen) => {
    const rows = fen.split(" ")[0].split("/");
    const board = [];

    rows.forEach((row) => {
      const boardRow = [];
      for (let char of row) {
        if (!isNaN(char)) {
          for (let i = 0; i < parseInt(char); i++) {
            boardRow.push(null);
          }
        } else {
          boardRow.push(char);
        }
      }
      board.push(boardRow);
    });

    return board;
  };

  const fenToPiece = (char) => {
    const color = char === char.toUpperCase() ? "white" : "black";
    const pieceMap = {
      k: "K",
      q: "Q",
      r: "R",
      b: "B",
      n: "N",
      p: "P",
    };
    const piece = pieceMap[char.toLowerCase()];
    return <Piece color={color} piece={piece} width={48} />;
  };

  const [board, setBoard] = useState(parseFEN(initialFEN));
  const [redSquares, setRedSquares] = useState([]);

  const handleRightClick = (event, row, col) => {
    event.preventDefault();
    const squareId = `${row}-${col}`;
    if (redSquares.includes(squareId)) {
      setRedSquares(redSquares.filter((id) => id !== squareId));
    } else {
      setRedSquares([...redSquares, squareId]);
    }
  };

  const movePiece = (from, to) => {
    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[from.row][from.col];
    newBoard[from.row][from.col] = null;
    newBoard[to.row][to.col] = piece;
    setBoard(newBoard);
  };

  const Square = ({ row, col, className, piece, movePiece, onRightClick }) => {
    const [, drop] = useDrop({
      accept: "PIECE",
      drop: (item) => {
        movePiece(item.position, { row, col });
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    });

    return (
      <div
        ref={drop}
        className={`${className} w-12 h-12 flex justify-center items-center`}
        onContextMenu={onRightClick}
      >
        {piece && <DraggablePiece piece={piece} position={{ row, col }} />}
      </div>
    );
  };

  const DraggablePiece = ({ piece, position }) => {
    const [, drag, preview] = useDrag({
      type: "PIECE",
      item: { piece, position },
    });

    return (
      <>
        <div ref={drag} className="cursor-grab">
          {piece}
        </div>
        <div ref={preview} style={{ display: "none" }}>
          {piece}
        </div>
      </>
    );
  };

  const renderSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const isRed = redSquares.includes(`${row}-${col}`);
    let className = isRed
      ? isBlack
        ? "bg-red-600"
        : "bg-red-400"
      : isBlack
      ? "bg-green-600"
      : "bg-gray-100";
    return (
      <Square
        key={`${row}-${col}`}
        row={row}
        col={col}
        className={className}
        piece={board[row][col] ? fenToPiece(board[row][col]) : null}
        movePiece={movePiece}
        onRightClick={(event) => handleRightClick(event, row, col)}
      />
    );
  };

  const renderRow = (row) => {
    const squares = [];
    for (let col = 0; col < 8; col++) {
      squares.push(renderSquare(row, col));
    }

    return (
      <div className="flex" key={row}>
        {squares}
      </div>
    );
  };

  const renderBoard = () => {
    const rows = [];
    for (let row = 0; row < 8; row++) {
      rows.push(renderRow(row));
    }
    return rows;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col border border-black">{renderBoard()}</div>
      </div>
    </DndProvider>
  );
};

export default App;