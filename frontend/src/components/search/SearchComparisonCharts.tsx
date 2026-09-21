import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface CompareResult {
  algorithm: string;
  result: {
    path_cost: number;
    nodes_explored: number;
    execution_time_ms: number;
  };
}

interface Props {
  results: Record<string, CompareResult>;
}

const COLORS: Record<string, string> = {
  'BFS': '#3b82f6', // blue-500
  'DFS': '#ef4444', // red-500
  'UCS': '#10b981', // emerald-500
  'GREEDY': '#f59e0b', // amber-500
  'ASTAR': '#8b5cf6', // violet-500
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded shadow-xl">
        <p className="font-bold text-white mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value.toFixed ? entry.value.toFixed(1) : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SearchComparisonCharts: React.FC<Props> = ({ results }) => {
  const data = Object.values(results).map(res => ({
    name: res.algorithm,
    Nodes: res.result.nodes_explored,
    Time: res.result.execution_time_ms,
    Cost: res.result.path_cost
  }));

  return (
    <div className="space-y-8 w-full max-w-5xl mx-auto p-6 bg-slate-900/80 rounded-xl border border-slate-700 backdrop-blur">
      <h3 className="text-xl font-bold text-white text-center mb-6">Algorithm Comparison Results</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Nodes Explored Chart */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h4 className="text-center font-medium text-slate-300 mb-4">Nodes Explored (Lower is Better)</h4>
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
        
        {/* Path Cost Chart */}
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 lg:col-span-2">
          <h4 className="text-center font-medium text-slate-300 mb-4">Final Path Cost (Lower is Better)</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Cost" radius={[4, 4, 0, 0]}>
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
        <p><strong>Note:</strong> Different algorithms optimize for different objectives. BFS guarantees the shortest path in unweighted grids. UCS/A* guarantee lowest cost in weighted grids. Greedy explores fewer nodes but may find sub-optimal paths. DFS explores deeply without path optimality guarantees.</p>
      </div>
    </div>
  );
};

export default SearchComparisonCharts;
