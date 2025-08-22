import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface SudokuGridProps {
  difficulty: 'easy' | 'medium' | 'hard';
  onSolved: () => void;
  onError: () => void;
  onRestart?: () => void; // Optional restart handler
  gameOver: boolean;
}

// Sudoku puzzles for different difficulties
const sudokuPuzzles = {
  easy: [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
  ],
  medium: [
    [0, 2, 0, 6, 0, 8, 0, 0, 0],
    [5, 8, 0, 0, 0, 9, 7, 0, 0],
    [0, 0, 0, 0, 4, 0, 0, 0, 0],
    [3, 7, 0, 0, 0, 0, 5, 0, 0],
    [6, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 8, 0, 0, 0, 0, 1, 3],
    [0, 0, 0, 0, 2, 0, 0, 0, 0],
    [0, 0, 9, 8, 0, 0, 0, 3, 6],
    [0, 0, 0, 3, 0, 6, 0, 9, 0]
  ],
  hard: [
    [0, 0, 0, 6, 0, 0, 4, 0, 0],
    [7, 0, 0, 0, 0, 3, 6, 0, 0],
    [0, 0, 0, 0, 9, 1, 0, 8, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 5, 0, 1, 8, 0, 0, 0, 3],
    [0, 0, 0, 3, 0, 6, 0, 4, 5],
    [0, 4, 0, 2, 0, 0, 0, 6, 0],
    [9, 0, 3, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 1, 0, 0]
  ]
};

const SudokuGrid: React.FC<SudokuGridProps> = ({ difficulty, onSolved, onError, onRestart, gameOver }) => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [initialGrid, setInitialGrid] = useState<number[][]>([]);
  const [errors, setErrors] = useState<boolean[][]>([]);
  const [correctCells, setCorrectCells] = useState<boolean[][]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number>(1);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  // Initialize grid based on difficulty
  useEffect(() => {
    const puzzle = sudokuPuzzles[difficulty];
    setGrid(puzzle.map((row) => [...row]));
    setInitialGrid(puzzle.map((row) => [...row]));
    setErrors(Array(9).fill(null).map(() => Array(9).fill(false)));
    setCorrectCells(Array(9).fill(null).map(() => Array(9).fill(false)));
  }, [difficulty]);

  // Validate sudoku rules
  const isValidMove = (grid: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (x !== col && grid[row][x] === num) {
        return false;
      }
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (x !== row && grid[x][col] === num) {
        return false;
      }
    }

    // Check 3x3 box
    const startRow = row - (row % 3);
    const startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentRow = startRow + i;
        const currentCol = startCol + j;
        if ((currentRow !== row || currentCol !== col) && grid[currentRow][currentCol] === num) {
          return false;
        }
      }
    }

    return true;
  };

  // Check if puzzle is solved
  const isSolved = (grid: number[][]): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (grid[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  };

  const handleCellClick = (row: number, col: number) => {
    if (initialGrid[row][col] !== 0 || gameOver) return; // Can't change prefilled cells or if game over

    setSelectedCell({ row, col });

    const newGrid = grid.map((r) => [...r]);
    const newErrors = errors.map((r) => [...r]);
    const newCorrectCells = correctCells.map((r) => [...r]);

    newGrid[row][col] = selectedNumber;

    // Validate the move
    if (selectedNumber !== 0 && !isValidMove(newGrid, row, col, selectedNumber)) {
      newErrors[row][col] = true;
      newCorrectCells[row][col] = false;
      onError();
      toast.error(`❌ خطأ! الرقم ${selectedNumber} غير مناسب هنا`);
    } else {
      newErrors[row][col] = false;
      newCorrectCells[row][col] = true;
      toast.success(`✅ ممتاز! الرقم ${selectedNumber} صحيح`, {
        duration: 1500,
      });
    }

    setGrid(newGrid);
    setErrors(newErrors);
    setCorrectCells(newCorrectCells);

    // Check if solved
    if (isSolved(newGrid) && !newErrors.some((row) => row.some((cell) => cell))) {
      onSolved();
    }
  };

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    setHighlightedNumber(number); // Keep for number selection, but not used for coloring
  };

  const handleRestart = () => {
    // Redirect to homepage instead of resetting the grid
    window.location.href = '/'; // Adjust this path if your homepage is different
  };

  const getCellClassName = (row: number, col: number) => {
    let className = 'sudoku-cell cursor-pointer text-black'; // Ensure text is visible

    if (initialGrid[row][col] !== 0) {
      className += ' prefilled cursor-not-allowed font-bold'; // Distinct style for prefilled cells
    } else {
      className += ' bg-white';
    }

    if (grid[row][col] !== 0 && initialGrid[row][col] === 0) {
      if (errors[row][col]) {
        className += ' border-2 border-red-500 animate-shake'; // Indicate error with red border
      } else if (correctCells[row][col]) {
        className += ' correct-cell'; // Add correct-cell for player-placed correct cells
      }
    }

    if (grid[row][col] !== 0) {
      className += ` number-${grid[row][col]}`;
    }

    if (selectedCell?.row === row && selectedCell?.col === col) {
      className += ' ring-2 ring-primary';
    }

    if (gameOver) {
      className += ' cursor-not-allowed opacity-50';
    }

    return className;
  };

  const getBorderClasses = (row: number, col: number) => {
    let borderClasses = '';

    if (row % 3 === 0 && row !== 0) borderClasses += ' border-t-2 border-t-foreground';
    if (col % 3 === 0 && col !== 0) borderClasses += ' border-l-2 border-l-foreground';
    if (row === 8) borderClasses += ' border-b-2 border-b-foreground';
    if (col === 8) borderClasses += ' border-r-2 border-r-foreground';

    return borderClasses;
  };

  return (
    <div className="space-y-6">
      {/* Game Over Overlay */}
      {gameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
          <div className="bg-background p-8 rounded-lg text-center border border-destructive">
            <h2 className="text-2xl font-bold text-destructive mb-4">💀 انتهت اللعبة!</h2>
            <p className="text-muted-foreground mb-4">انتهت جميع الأرواح</p>
            <button
              onClick={handleRestart}
              className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-all mt-4"
            >
              إعادة اللعب
            </button>
          </div>
        </div>
      )}

      {/* Sudoku Grid */}
      <div className="game-card p-6 relative">
        <div className="grid grid-cols-9 gap-1 max-w-lg mx-auto">
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`${getCellClassName(rowIndex, colIndex)} ${getBorderClasses(rowIndex, colIndex)} flex items-center justify-center relative overflow-hidden w-12 h-12`}
                style={
                  initialGrid[rowIndex][colIndex] !== 0
                    ? {
                        backgroundColor:
                          initialGrid[rowIndex][colIndex] === 1 ? '#BFDBFE' : // أزرق فاتح
                          initialGrid[rowIndex][colIndex] === 2 ? '#D1FAE5' : // أخضر فاتح
                          initialGrid[rowIndex][colIndex] === 3 ? '#FEE2E2' : // أحمر فاتح
                          initialGrid[rowIndex][colIndex] === 4 ? '#FEF3C7' : // أصفر فاتح
                          initialGrid[rowIndex][colIndex] === 5 ? '#EDE9FE' : // بنفسجي فاتح
                          initialGrid[rowIndex][colIndex] === 6 ? '#FCE7F3' : // وردي فاتح
                          initialGrid[rowIndex][colIndex] === 7 ? '#E0E7FF' : // نيلي فاتح
                          initialGrid[rowIndex][colIndex] === 8 ? '#FFEDD5' : // برتقالي فاتح
                          initialGrid[rowIndex][colIndex] === 9 ? '#CCFBF1' : // أخضر مائل للأزرق فاتح
                          '#FFFFFF' // Default to white if no match
                      }
                    : { backgroundColor: '#FFFFFF' } // Empty cells are white
                }
              >
                {cell === 0 ? '' : cell}
                {correctCells[rowIndex][colIndex] && initialGrid[rowIndex][colIndex] === 0 && (
                  <div className="absolute inset-0 animate-pulse opacity-20"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Picker */}
      <div className="game-card p-6">
        <h3 className="text-lg font-bold text-center mb-4 text-primary">اختر الرقم</h3>
        <div className="grid grid-cols-9 gap-2 max-w-lg mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              disabled={gameOver}
              className={`w-12 h-12 rounded-lg border-2 font-bold text-lg transition-all duration-200 hover:scale-110 text-black ${
                selectedNumber === number
                  ? 'border-primary bg-primary/20 text-primary scale-110 shadow-lg'
                  : 'border-muted hover:border-primary/50'
              } ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{
                backgroundColor:
                  number === 1 ? '#BFDBFE' : // أزرق فاتح
                  number === 2 ? '#D1FAE5' : // أخضر فاتح
                  number === 3 ? '#FEE2E2' : // أحمر فاتح
                  number === 4 ? '#FEF3C7' : // أصفر فاتح
                  number === 5 ? '#EDE9FE' : // بنفسجي فاتح
                  number === 6 ? '#FCE7F3' : // وردي فاتح
                  number === 7 ? '#E0E7FF' : // نيلي فاتح
                  number === 8 ? '#FFEDD5' : // برتقالي فاتح
                  number === 9 ? '#CCFBF1' : // أخضر مائل للأزرق فاتح
                  '#FFFFFF' // Default (should not occur)
              }}
            >
              {number}
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          {gameOver ? 'اللعبة انتهت' : 'انقر على خانة في السودوكو ثم اختر الرقم المناسب'}
        </p>
      </div>
    </div>
  );
};

export default SudokuGrid;