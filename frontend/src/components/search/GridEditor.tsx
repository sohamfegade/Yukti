import React, { useState } from 'react';

export type Coord = [number, number];
export type GridState = {
  width: number;
  height: number;
  start: Coord;
  goal: Coord;
  obstacles: Coord[];
  weights: Record<string, number>;
};

export type PaintMode = 'start' | 'goal' | 'obstacle' | 'weight' | 'erase';

interface GridEditorProps {
  grid: GridState;
  onChange: (newGrid: GridState) => void;
  paintMode: PaintMode;
  readOnly?: boolean;
}

const GridEditor: React.FC<GridEditorProps> = ({ grid, onChange, paintMode, readOnly = false }) => {
  const [isDragging, setIsDragging] = useState(false);

  const isStart = (x: number, y: number) => grid.start[0] === x && grid.start[1] === y;
  const isGoal = (x: number, y: number) => grid.goal[0] === x && grid.goal[1] === y;
  const isObstacle = (x: number, y: number) => grid.obstacles.some(o => o[0] === x && o[1] === y);
  const getWeight = (x: number, y: number) => grid.weights[`${x},${y}`];

  const handleCellClick = (x: number, y: number) => {
    if (readOnly) return;
    
    const newGrid = { ...grid };
    const isOb = isObstacle(x, y);
    const key = `${x},${y}`;

    if (paintMode === 'start') {
      newGrid.start = [x, y];
      if (isOb) newGrid.obstacles = newGrid.obstacles.filter(o => o[0] !== x || o[1] !== y);
    } else if (paintMode === 'goal') {
      newGrid.goal = [x, y];
      if (isOb) newGrid.obstacles = newGrid.obstacles.filter(o => o[0] !== x || o[1] !== y);
    } else if (paintMode === 'obstacle') {
      if (!isStart(x, y) && !isGoal(x, y) && !isOb) {
        newGrid.obstacles = [...newGrid.obstacles, [x, y]];
        delete newGrid.weights[key];
      }
    } else if (paintMode === 'weight') {
      if (!isStart(x, y) && !isGoal(x, y) && !isOb) {
        newGrid.weights = { ...newGrid.weights, [key]: 5 }; // Hardcode weight 5 for simplicity
      }
    } else if (paintMode === 'erase') {
      newGrid.obstacles = newGrid.obstacles.filter(o => o[0] !== x || o[1] !== y);
      const newWeights = { ...newGrid.weights };
      delete newWeights[key];
      newGrid.weights = newWeights;
    }
    
    onChange(newGrid);
  };

  const handleMouseDown = (x: number, y: number) => {
    setIsDragging(true);
    handleCellClick(x, y);
  };

  const handleMouseEnter = (x: number, y: number) => {
    if (isDragging) {
      handleCellClick(x, y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="inline-block border border-slate-700 bg-slate-900 rounded-lg p-2"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div 
        className="grid gap-px bg-slate-700" 
        style={{ 
          gridTemplateColumns: `repeat(${grid.width}, minmax(0, 1fr))`,
          width: 'max-content'
        }}
      >
        {Array.from({ length: grid.height }).map((_, y) => 
          Array.from({ length: grid.width }).map((_, x) => {
            const isS = isStart(x, y);
            const isG = isGoal(x, y);
            const isO = isObstacle(x, y);
            const weight = getWeight(x, y);
            
            let bgClass = "bg-slate-800";
            if (isS) bgClass = "bg-blue-500";
            else if (isG) bgClass = "bg-emerald-500";
            else if (isO) bgClass = "bg-slate-500";
            else if (weight) bgClass = "bg-amber-600/50";

            return (
              <div
                key={`${x}-${y}`}
                className={`w-6 h-6 sm:w-8 sm:h-8 ${bgClass} hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center`}
                onMouseDown={() => handleMouseDown(x, y)}
                onMouseEnter={() => handleMouseEnter(x, y)}
              >
                {weight && !isS && !isG && <span className="text-[10px] text-white/70">{weight}</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GridEditor;
