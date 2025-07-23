import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette from the project requirements
const COLORS = {
  primary: "#1976d2",    // Primary (blue)
  secondary: "#ffffff",  // Secondary (white)
  accent: "#ff9800"      // Accent (orange)
};

function getInitialBoard() {
  // 3x3 array filled with nulls
  return Array(3)
    .fill(null)
    .map(() => Array(3).fill(null));
}

// PUBLIC_INTERFACE
function App() {
  // Game state
  const [board, setBoard] = useState(getInitialBoard());
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("Next player: X");
  const [winner, setWinner] = useState(null);

  // Responsive/centered layout
  useEffect(() => {
    document.body.style.background = COLORS.primary;
    document.body.style.margin = 0;
  }, []);

  // Compute status when board or turn changes
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (isDraw(board)) {
      setStatus("It's a draw!");
    } else {
      setStatus(`Next player: ${xIsNext ? "X" : "O"}`);
    }
    setWinner(winner);
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  function handleClick(row, col) {
    // Do not allow move if square filled or game over
    if (board[row][col] || winner) return;

    const boardCopy = board.map((rowArr) => rowArr.slice());
    boardCopy[row][col] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(getInitialBoard());
    setXIsNext(true);
    setWinner(null);
    setStatus("Next player: X");
  }

  return (
    <div className="ttt-root">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-status">{status}</div>
        <Board
          board={board}
          onCellClick={handleClick}
          accentColor={COLORS.accent}
          winner={winner}
        />
        <button
          className="ttt-reset-btn"
          onClick={handleReset}
          style={{
            backgroundColor: COLORS.primary,
            color: COLORS.secondary,
            borderColor: COLORS.accent,
          }}
        >
          Reset Game
        </button>
      </div>
      <footer className="ttt-footer">
        <span>
          <span style={{ color: COLORS.accent }}>Two Player</span> &mdash; Modern UI
        </span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onCellClick, accentColor, winner }) {
  return (
    <div className="ttt-board">
      {board.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <Cell
            key={`${rowIdx}-${colIdx}`}
            value={cell}
            onClick={() => onCellClick(rowIdx, colIdx)}
            accentColor={accentColor}
            disabled={!!cell || winner}
          />
        ))
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function Cell({ value, onClick, accentColor, disabled }) {
  return (
    <button
      className="ttt-cell"
      style={{
        color: value === "X" ? accentColor : "#fff",
        backgroundColor: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.1s"
      }}
      onClick={onClick}
      disabled={disabled}
      aria-label={"Tic Tac Toe cell"}
      tabIndex={disabled ? -1 : 0}
    >
      {value || ""}
    </button>
  );
}

// PUBLIC_INTERFACE
function calculateWinner(board) {
  // All possible winning combos (rows, cols, diags)
  const lines = [
    // Rows
    [[0,0],[0,1],[0,2]],
    [[1,0],[1,1],[1,2]],
    [[2,0],[2,1],[2,2]],
    // Cols
    [[0,0],[1,0],[2,0]],
    [[0,1],[1,1],[2,1]],
    [[0,2],[1,2],[2,2]],
    // Diags
    [[0,0],[1,1],[2,2]],
    [[0,2],[1,1],[2,0]],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[b[0]][b[1]] === board[c[0]][c[1]]
    ) {
      return board[a[0]][a[1]];
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isDraw(board) {
  return board.flat().every(cell => cell) && !calculateWinner(board);
}

export default App;
