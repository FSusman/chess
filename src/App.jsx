import React from "react";

const App = () => {
  const renderSquare = (row, col) => {
    const isBlack = (row + col) % 2 === 1;
    const className = isBlack ? "bg-black" : "bg-white";
    return (
      <div key={`${row}-${col}`} className={`${className} w-12 h-12`}></div>
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
