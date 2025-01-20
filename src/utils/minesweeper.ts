export type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  row: number;
  col: number;
};

export type GameState = "playing" | "won" | "lost";

export const createBoard = (rows: number, cols: number, mines: number): Cell[][] => {
  console.log("Creating new board:", { rows, cols, mines });
  
  // Initialize empty board
  let board: Cell[][] = Array(rows).fill(null).map((_, row) =>
    Array(cols).fill(null).map((_, col) => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      row,
      col,
    }))
  );

  // Place mines randomly
  let minesPlaced = 0;
  while (minesPlaced < mines) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (!board[row][col].isMine) {
      board[row][col].isMine = true;
      minesPlaced++;
    }
  }

  // Calculate neighbor mines
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < rows && col + j >= 0 && col + j < cols) {
              if (board[row + i][col + j].isMine) count++;
            }
          }
        }
        board[row][col].neighborMines = count;
      }
    }
  }

  return board;
};

export const revealCell = (board: Cell[][], row: number, col: number): Cell[][] => {
  console.log("Revealing cell:", { row, col });
  
  if (row < 0 || row >= board.length || col < 0 || col >= board[0].length) return board;
  if (board[row][col].isRevealed || board[row][col].isFlagged) return board;

  const newBoard = board.map(row => [...row]);
  newBoard[row][col].isRevealed = true;

  if (newBoard[row][col].neighborMines === 0 && !newBoard[row][col].isMine) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        revealCell(newBoard, row + i, col + j);
      }
    }
  }

  return newBoard;
};

export const checkWin = (board: Cell[][]): boolean => {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const cell = board[row][col];
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
};