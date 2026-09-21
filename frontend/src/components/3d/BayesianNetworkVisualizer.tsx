import React from 'react';
import { Sphere, Line, Html } from '@react-three/drei';

interface BayesianNode {
  id: string;
  label: string;
  probability: number;
}

interface BayesianEdge {
  source: string;
  target: string;
  label: string;
}

interface BayesianNetwork {
  nodes: BayesianNode[];
  edges: BayesianEdge[];
}

interface BayesianNetworkVisualizerProps {
  network: BayesianNetwork;
}

const BayesianNetworkVisualizer: React.FC<BayesianNetworkVisualizerProps> = ({ network }) => {
  // Hardcode positions for the 3-node demo network
  const positions: Record<string, [number, number, number]> = {
    'prior': [-4, 3, 0],
    'evidence': [4, 3, 0],
    'posterior': [0, -2, 0]
  };

  const colors: Record<string, string> = {
    'prior': '#3b82f6', // blue
    'evidence': '#f59e0b', // amber
    'posterior': '#d946ef' // fuchsia
  };

  return (
    <group position={[0, 0, 0]}>
      {/* Draw Edges */}
      {network.edges.map((edge, i) => {
        const start = positions[edge.source];
        const end = positions[edge.target];
        if (!start || !end) return null;
        
        // Calculate midpoint for edge label
        const midX = (start[0] + end[0]) / 2;
        const midY = (start[1] + end[1]) / 2;
        const midZ = (start[2] + end[2]) / 2;

        return (
          <group key={`edge-${i}`}>
            <Line 
              points={[start, end]} 
              color="#475569" 
              lineWidth={3} 
              dashed={true}
              dashScale={5}
              dashSize={1}
            />
            
            <Html position={[midX, midY, midZ]} center>
              <div className="bg-slate-900/80 text-slate-300 text-xs px-2 py-1 rounded border border-slate-700 backdrop-blur whitespace-nowrap">
                {edge.label}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Draw Nodes */}
      {network.nodes.map((node, i) => {
        const pos = positions[node.id] || [0, 0, 0];
        const color = colors[node.id] || '#94a3b8';
        
        // Scale node size based on probability (with min/max constraints)
        const scale = 0.8 + (node.probability * 0.7);

        return (
          <group key={`node-${i}`} position={pos}>
            <Sphere args={[scale, 32, 32]}>
              <meshStandardMaterial 
                color={color} 
                transparent 
                opacity={0.8} 
                roughness={0.2} 
                metalness={0.5}
                emissive={color}
                emissiveIntensity={0.2}
              />
            </Sphere>
            
            {/* Halo effect */}
            <Sphere args={[scale * 1.2, 16, 16]}>
              <meshBasicMaterial color={color} transparent opacity={0.1} wireframe />
            </Sphere>

            <Html position={[0, -scale - 0.5, 0]} center zIndexRange={[100, 0]}>
              <div className="flex flex-col items-center pointer-events-none">
                <div className="bg-slate-900/90 text-white font-bold px-3 py-1.5 rounded-t border-t border-l border-r border-slate-700 whitespace-nowrap text-sm">
                  {node.label}
                </div>
                <div className="bg-slate-800 text-emerald-400 font-mono font-bold px-3 py-1 rounded-b border border-slate-700 text-base shadow-xl">
                  {(node.probability * 100).toFixed(2)}%
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

export default BayesianNetworkVisualizer;
