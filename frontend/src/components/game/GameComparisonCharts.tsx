import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface GameCompareResult {
  algorithm: string;
  nodes_evaluated: number;
  nodes_pruned: number;
  time_ms: number;
}

interface Props {
  results: GameCompareResult[];
}

const COLORS: Record<string, string> = {
  'MINIMAX': '#ef4444', // red-500
  'ALPHABETA': '#10b981', // emerald-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed && entry.name === 'Time' ? entry.value.toFixed(2) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const GameComparisonCharts: React.FC<Props> = ({ results }) => {
  const data = results.map(res => ({
    name: res.algorithm,
    Nodes: res.nodes_evaluated,
    Pruned: res.nodes_pruned,
    Time: res.time_ms
  }));

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto p-6 bg-slate-900/80 rounded-xl border border-slate-700 backdrop-blur">
      <h3 className="text-xl font-bold text-white text-center mb-6">Algorithm Comparison Results</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nodes Evaluated Chart */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="text-center font-medium text-slate-300 mb-4">Nodes Evaluated (Lower is Better)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Nodes" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Execution Time Chart */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="text-center font-medium text-slate-300 mb-4">Execution Time (ms) (Lower is Better)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Time" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center text-slate-400 text-sm bg-slate-800 p-4 rounded-lg">
        <p><strong>Note:</strong> Alpha-Beta pruning evaluates significantly fewer nodes than Minimax to arrive at the exact same optimal decision, demonstrating superior efficiency, especially in complex game states.</p>
      </div>
    </div>
  );
};

export default GameComparisonCharts;
