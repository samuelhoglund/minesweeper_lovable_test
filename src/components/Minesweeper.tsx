import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Cell, GameState, createBoard, revealCell, checkWin } from '@/utils/minesweeper';
import { Button } from "@/components/ui/button";
import { Timer, Flag, Bomb } from 'lucide-react';
import MinesweeperThemeSettings, { Theme } from './MinesweeperThemeSettings';

const ROWS = 9;
const COLS = 9;
const MINES = 10;

const defaultTheme: Theme = {
  name: "Classic",
  unexploredTile: "#8E9196",
  exploredTile: "#f3f3f3"
};

const Minesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>(() => createBoard(ROWS, COLS, MINES));
  const [gameState, setGameState] = useState<GameState>("playing");
  const [flags, setFlags] = useState(MINES);
  const [time, setTime] = useState(0);
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const { toast } = useToast();

  useEffect(() => {
    let interval: number | undefined;
    if (gameState === "playing") {
      interval = window.setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState !== "playing") return;
    
    console.log("Cell clicked:", { row, col });
    
    const cell = board[row][col];
    if (cell.isFlagged) return;

    if (cell.isMine) {
      setGameState("lost");
      toast({
        title: "Game Over!",
        description: "You hit a mine! Try again?",
        variant: "destructive",
      });
      return;
    }

    const newBoard = revealCell(board, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setGameState("won");
      toast({
        title: "Congratulations!",
        description: "You won! Play again?",
      });
    }
  }, [board, gameState, toast]);

  const handleContextMenu = useCallback((e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== "playing") return;
    
    console.log("Right click:", { row, col });
    
    const newBoard = board.map(r => [...r]);
    const cell = newBoard[row][col];

    if (!cell.isRevealed) {
      if (!cell.isFlagged && flags > 0) {
        cell.isFlagged = true;
        setFlags(f => f - 1);
      } else if (cell.isFlagged) {
        cell.isFlagged = false;
        setFlags(f => f + 1);
      }
      setBoard(newBoard);
    }
  }, [board, gameState, flags]);

  const resetGame = useCallback(() => {
    console.log("Resetting game");
    setBoard(createBoard(ROWS, COLS, MINES));
    setGameState("playing");
    setFlags(MINES);
    setTime(0);
  }, []);

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed) return theme.unexploredTile;
    if (cell.isMine) return "bg-red-500";
    return theme.exploredTile;
  };

  const getNumberColor = (num: number) => {
    const colors = [
      "",
      "text-blue-600",
      "text-green-600",
      "text-red-600",
      "text-purple-600",
      "text-yellow-600",
      "text-cyan-600",
      "text-gray-600",
      "text-gray-800"
    ];
    return colors[num];
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <MinesweeperThemeSettings
          currentTheme={theme}
          onThemeChange={setTheme}
        />
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              <span className="font-bold">{flags}</span>
            </div>
            <Button
              onClick={resetGame}
              variant="outline"
              className="px-4 py-2"
            >
              Reset
            </Button>
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5" />
              <span className="font-bold">{time}</span>
            </div>
          </div>
          
          <div className="grid gap-1" style={{ 
            gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` 
          }}>
            {board.map((row, i) =>
              row.map((cell, j) => (
                <button
                  key={`${i}-${j}`}
                  onClick={() => handleCellClick(i, j)}
                  onContextMenu={(e) => handleContextMenu(e, i, j)}
                  style={{
                    backgroundColor: getCellColor(cell)
                  }}
                  className={`
                    w-8 h-8 flex items-center justify-center
                    border border-gray-300 rounded
                    transition-colors duration-200
                    ${cell.isRevealed ? "shadow-inner" : "shadow-sm"}
                    ${gameState !== "playing" ? "cursor-not-allowed" : "cursor-pointer"}
                    hover:brightness-95
                  `}
                  disabled={gameState !== "playing"}
                >
                  {cell.isFlagged ? (
                    <Flag className="w-4 h-4" />
                  ) : cell.isRevealed ? (
                    cell.isMine ? (
                      <Bomb className="w-4 h-4" />
                    ) : cell.neighborMines > 0 ? (
                      <span className={`font-bold ${getNumberColor(cell.neighborMines)}`}>
                        {cell.neighborMines}
                      </span>
                    ) : null
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>
        
        {gameState !== "playing" && (
          <div className="mt-4 text-center">
            <p className="text-lg font-bold mb-2">
              {gameState === "won" ? "Congratulations! 🎉" : "Game Over! 💣"}
            </p>
            <Button onClick={resetGame}>
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Minesweeper;