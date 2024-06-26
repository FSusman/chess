import React, { useState } from "react";

const App = () => {
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

  const renderSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const isRed = redSquares.includes(`${row}-${col}`);
    let className = isRed
      ? isBlack
        ? "bg-red-600"
        : "bg-red-400"
      : isBlack
      ? "bg-black"
      : "bg-white";
    return (
      <div
        key={`${row}-${col}`}
        className={`${className} w-12 h-12`}
        onContextMenu={(event) => handleRightClick(event, row, col)}
        onClick={(e) => setRedSquares([])}
      ></div>
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
    <div className="flex justify-center items-center h-screen">
      <div className="flex flex-col border border-black">{renderBoard()}</div>
    </div>
  );
};

export default App;
