import React, { useRef, useMemo } from 'react';
import type { GridState } from '../search/GridEditor';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

interface TraceStep {
  step: number;
  current_node?: [number, number];
  frontier: [number, number][];
  visited: [number, number][];
}

interface Search3DVisualizerProps {
  grid: GridState;
  currentStep?: TraceStep;
  path?: [number, number][];
}

const Search3DVisualizer: React.FC<Search3DVisualizerProps> = ({ grid, currentStep, path }) => {
  const group = useRef<THREE.Group>(null);
  
  // Center the grid
  const offsetX = -grid.width / 2;
  const offsetZ = -grid.height / 2;
  
  const isObstacle = (x: number, z: number) => grid.obstacles.some(o => o[0] === x && o[1] === z);
  const isStart = (x: number, z: number) => grid.start[0] === x && grid.start[1] === z;
  const isGoal = (x: number, z: number) => grid.goal[0] === x && grid.goal[1] === z;
  
  const isVisited = (x: number, z: number) => currentStep?.visited.some(v => v[0] === x && v[1] === z);
  const isFrontier = (x: number, z: number) => currentStep?.frontier.some(f => f[0] === x && f[1] === z);
  const isCurrent = (x: number, z: number) => currentStep?.current_node?.[0] === x && currentStep?.current_node?.[1] === z;
  const isPath = (x: number, z: number) => path?.some(p => p[0] === x && p[1] === z);

  const cells = useMemo(() => {
    const arr = [];
    for (let x = 0; x < grid.width; x++) {
      for (let z = 0; z < grid.height; z++) {
        arr.push({ x, z });
      }
    }
    return arr;
  }, [grid.width, grid.height]);

  return (
    <group ref={group} position={[offsetX, 0, offsetZ]}>
      {cells.map(({ x, z }) => {
        const obs = isObstacle(x, z);
        const start = isStart(x, z);
        const goal = isGoal(x, z);
        const current = isCurrent(x, z);
        const frontier = isFrontier(x, z);
        const visited = isVisited(x, z);
        const inPath = isPath(x, z);
        
        let color = "#1e293b"; // base slate-800
        let height = 0.1;
        let yPos = 0;
        
        if (obs) {
          color = "#64748b"; // slate-500
          height = 1.0;
          yPos = 0.45;
        } else if (start) {
          color = "#3b82f6"; // blue-500
          height = 0.5;
          yPos = 0.2;
        } else if (goal) {
          color = "#10b981"; // emerald-500
          height = 0.5;
          yPos = 0.2;
        } else if (inPath) {
          color = "#eab308"; // yellow-500
          height = 0.3;
          yPos = 0.1;
        } else if (current) {
          color = "#ef4444"; // red-500
          height = 0.4;
          yPos = 0.15;
        } else if (frontier) {
          color = "#8b5cf6"; // violet-500
          height = 0.2;
          yPos = 0.05;
        } else if (visited) {
          color = "#334155"; // slate-700
          height = 0.15;
          yPos = 0.025;
        }
        
        const weight = grid.weights[`${x},${z}`];
        if (weight && !obs && !start && !goal && !current && !frontier && !visited && !inPath) {
          color = "#b45309"; // amber-700 for weight
        }

        return (
          <Box 
            key={`${x}-${z}`} 
            position={[x, yPos, z]} 
            args={[0.9, height, 0.9]}
          >
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
          </Box>
        );
      })}
    </group>
  );
};

export default Search3DVisualizer;
