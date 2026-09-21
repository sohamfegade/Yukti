import React from 'react';

type Player = "X" | "O" | "";

interface TicTacToeBoardProps {
  board: Player[];
  onCellClick: (index: number) => void;
  disabled?: boolean;
  winningLine?: number[];
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onCellClick, disabled = false, winningLine = [] }) => {
  return (
    <div className="inline-grid grid-cols-3 gap-2 bg-slate-700 p-2 rounded-xl shadow-2xl">
      {board.map((cell, index) => {
        const isWinningCell = winningLine.includes(index);
        return (
          <button
            key={index}
            onClick={() => onCellClick(index)}
            disabled={disabled || cell !== ""}
            className={`
              w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-slate-900 rounded-lg flex items-center justify-center
              text-4xl sm:text-5xl md:text-7xl font-bold transition-all duration-300
              ${cell === "" && !disabled ? "hover:bg-slate-800 cursor-pointer" : "cursor-default"}
              ${cell === "X" ? "text-blue-500" : "text-emerald-500"}
              ${isWinningCell ? "shadow-[0_0_20px_rgba(255,255,255,0.2)] bg-slate-800" : ""}
            `}
            style={{
              textShadow: cell === "X" ? (isWinningCell ? "0 0 20px #3b82f6" : "0 0 10px rgba(59, 130, 246, 0.5)") 
                        : (cell === "O" ? (isWinningCell ? "0 0 20px #10b981" : "0 0 10px rgba(16, 185, 129, 0.5)") : "none")
            }}
          >
            {cell}
          </button>
        );
      })}
    </div>
  );
};

export default TicTacToeBoard;
