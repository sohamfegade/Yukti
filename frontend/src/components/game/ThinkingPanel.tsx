import React from 'react';
import { BrainCircuit, Scissors, GitFork, Target } from 'lucide-react';

interface ThinkingPanelProps {
  algorithm: string;
  nodesEvaluated: number;
  nodesPruned: number;
  score: number;
  bestMove: number;
  isThinking: boolean;
}

const ThinkingPanel: React.FC<ThinkingPanelProps> = ({ 
  algorithm, nodesEvaluated, nodesPruned, score, bestMove, isThinking 
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-5 shadow-xl">
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
        <BrainCircuit className="w-5 h-5 text-blue-400" />
        AI Engine Telemetry
      </h3>
      
      {isThinking ? (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-slate-400 font-medium">Evaluating game tree...</p>
        </div>
      ) : nodesEvaluated > 0 ? (
        <div className="space-y-4">
          <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <p className="text-slate-300 text-sm mb-1 font-medium">Analysis Complete</p>
            <p className="text-slate-400 text-xs">
              Using <span className="text-blue-400 font-semibold">{algorithm}</span>, the engine determined that moving to position <span className="text-white font-mono bg-slate-700 px-1 rounded">{bestMove}</span> is mathematically optimal.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <GitFork className="w-4 h-4" /> Nodes Evaluated
              </div>
              <div className="text-xl font-mono text-white">{nodesEvaluated.toLocaleString()}</div>
            </div>
            
            <div className={`bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 ${nodesPruned > 0 ? 'border-amber-500/30' : ''}`}>
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Scissors className={`w-4 h-4 ${nodesPruned > 0 ? 'text-amber-400' : ''}`} /> Branches Pruned
              </div>
              <div className={`text-xl font-mono ${nodesPruned > 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                {nodesPruned.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 col-span-2 flex justify-between items-center">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Target className="w-4 h-4" /> Minimax Evaluation Score
              </div>
              <div className={`text-lg font-mono font-bold ${score > 0 ? 'text-emerald-400' : score < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {score > 0 ? `+${score}` : score}
              </div>
            </div>
          </div>
          
          {nodesPruned > 0 && (
            <div className="text-xs text-amber-400/80 bg-amber-900/20 p-2 rounded border border-amber-700/30">
              <strong>Alpha-Beta Pruning active:</strong> Engine skipped evaluating {nodesPruned} sub-trees because they were mathematically proven to be worse than previously found paths.
            </div>
          )}
        </div>
      ) : (
        <div className="py-8 text-center text-slate-500 text-sm">
          Awaiting game state...
        </div>
      )}
    </div>
  );
};

export default ThinkingPanel;
