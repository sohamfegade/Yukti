import React, { useMemo } from 'react';
import { Box, Text, Line } from '@react-three/drei';

interface TreeNodeType {
  id: string;
  board: string[];
  player: string;
  move?: number;
  score?: number;
  is_pruned: boolean;
  alpha?: number;
  beta?: number;
  children: TreeNodeType[];
}

interface GameTreeVisualizerProps {
  tree: TreeNodeType;
  maxRenderDepth?: number;
}

const LEVEL_HEIGHT = -2.5;
const BASE_WIDTH = 20;

// Helper to flatten tree and calculate positions
const calculateNodePositions = (
  node: TreeNodeType, 
  depth: number, 
  x: number, 
  availableWidth: number, 
  maxDepth: number,
  result: any[] = []
) => {
  if (depth > maxDepth) return result;
  
  const y = depth * LEVEL_HEIGHT;
  
  result.push({
    node,
    x,
    y,
    depth
  });
  
  const numChildren = node.children.length;
  if (numChildren > 0 && depth < maxDepth) {
    const childWidth = availableWidth / numChildren;
    const startX = x - (availableWidth / 2) + (childWidth / 2);
    
    node.children.forEach((child, i) => {
      calculateNodePositions(
        child,
        depth + 1,
        startX + (i * childWidth),
        childWidth * 0.9,
        maxDepth,
        result
      );
    });
  }
  
  return result;
};

const NodeBox: React.FC<{
  x: number; y: number; node: TreeNodeType; 
}> = ({ x, y, node }) => {
  const isPruned = node.is_pruned;
  const isSelected = node.move !== undefined && node.score !== undefined && Math.abs(node.score) >= 10;
  
  let color = "#334155"; // slate-700
  if (isPruned) color = "#ef4444"; // red-500
  else if (isSelected) color = "#3b82f6"; // blue-500
  
  return (
    <group position={[x, y, 0]}>
      {/* Node Cube */}
      <Box args={[1.2, 0.8, 0.2]}>
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={isPruned ? 0.3 : 0.9} 
          roughness={0.4}
        />
      </Box>
      
      {/* Node text content */}
      <Text 
        position={[0, 0, 0.15]} 
        fontSize={0.2} 
        color={isPruned ? "#fca5a5" : "#ffffff"}
        anchorX="center"
        anchorY="middle"
      >
        {isPruned ? "PRUNED" : (node.score !== undefined ? `Score: ${node.score}` : 'Eval')}
      </Text>
      
      {/* Display Move if present */}
      {node.move !== undefined && node.move !== null && (
        <Text 
          position={[0, 0.6, 0]} 
          fontSize={0.15} 
          color="#94a3b8"
        >
          {`Move: ${node.move}`}
        </Text>
      )}
    </group>
  );
};

const GameTreeVisualizer: React.FC<GameTreeVisualizerProps> = ({ tree, maxRenderDepth = 3 }) => {
  const positionedNodes = useMemo(() => {
    return calculateNodePositions(tree, 0, 0, BASE_WIDTH, maxRenderDepth);
  }, [tree, maxRenderDepth]);

  // Create lines connecting parents to children
  const edges = useMemo(() => {
    const lines: any[] = [];
    
    // We need a map to find parent coordinates easily, or just do it recursively
    const buildEdges = (node: TreeNodeType, parentPos: [number, number, number], depth: number, x: number, availableWidth: number) => {
      if (depth >= maxRenderDepth) return;
      
      const numChildren = node.children.length;
      if (numChildren > 0) {
        const childWidth = availableWidth / numChildren;
        const startX = x - (availableWidth / 2) + (childWidth / 2);
        
        node.children.forEach((child, i) => {
          const childX = startX + (i * childWidth);
          const childY = (depth + 1) * LEVEL_HEIGHT;
          
          lines.push({
            start: parentPos,
            end: [childX, childY, 0],
            isPruned: child.is_pruned
          });
          
          buildEdges(child, [childX, childY, 0], depth + 1, childX, childWidth * 0.9);
        });
      }
    };
    
    buildEdges(tree, [0, 0, 0], 0, 0, BASE_WIDTH);
    return lines;
  }, [tree, maxRenderDepth]);

  return (
    <group position={[0, (maxRenderDepth * Math.abs(LEVEL_HEIGHT)) / 2, 0]}>
      {edges.map((edge, i) => (
        <Line 
          key={`line-${i}`}
          points={[edge.start, edge.end]}
          color={edge.isPruned ? "#7f1d1d" : "#475569"} // red-900 if pruned, slate-600 else
          lineWidth={edge.isPruned ? 1 : 2}
          transparent
          opacity={edge.isPruned ? 0.3 : 0.6}
        />
      ))}
      
      {positionedNodes.map((pn, i) => (
        <NodeBox key={`node-${i}`} x={pn.x} y={pn.y} node={pn.node} />
      ))}
    </group>
  );
};

export default GameTreeVisualizer;
