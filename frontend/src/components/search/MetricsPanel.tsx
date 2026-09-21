import React from 'react';

interface TraceStep {
  step: number;
  current_node?: [number, number];
  frontier: [number, number][];
  visited: [number, number][];
  action: string;
  g_cost?: number;
  h_cost?: number;
  f_cost?: number;
}

interface SearchResult {
  path: [number, number][];
  path_cost: number;
  nodes_explored: number;
  execution_time_ms: number;
  success: boolean;
}

interface MetricsPanelProps {
  currentStep?: TraceStep;
  finalResult?: SearchResult;
  algorithm: string;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ currentStep, finalResult, algorithm }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-4 shadow-xl text-sm flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold text-white mb-1">{algorithm}</h3>
        {currentStep ? (
          <p className="text-blue-400 font-medium">{currentStep.action}</p>
        ) : (
          <p className="text-slate-400">Algorithm not running</p>
        )}
      </div>

      {currentStep && (
        <div className="grid grid-cols-2 gap-2 text-slate-300 bg-slate-800/50 p-3 rounded border border-slate-700/50">
          <div>
            <span className="block text-slate-500 text-xs">Step</span>
            <span className="font-mono">{currentStep.step}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Current Node</span>
            <span className="font-mono">{currentStep.current_node ? `[${currentStep.current_node[0]}, ${currentStep.current_node[1]}]` : '-'}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Frontier Size</span>
            <span className="font-mono">{currentStep.frontier.length}</span>
          </div>
          <div>
            <span className="block text-slate-500 text-xs">Nodes Visited</span>
            <span className="font-mono">{currentStep.visited.length}</span>
          </div>
          
          {currentStep.f_cost !== undefined && currentStep.f_cost !== null && (
            <div className="col-span-2 flex justify-between mt-2 pt-2 border-t border-slate-700/50">
              <div>
                <span className="block text-slate-500 text-xs">g(n) Cost</span>
                <span className="font-mono text-emerald-400">{currentStep.g_cost?.toFixed(1)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">h(n) Cost</span>
                <span className="font-mono text-amber-400">{currentStep.h_cost?.toFixed(1)}</span>
              </div>
              <div>
                <span className="block text-slate-500 text-xs">f(n) Cost</span>
                <span className="font-mono text-blue-400">{currentStep.f_cost?.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {finalResult && (
        <div className="bg-emerald-900/20 border border-emerald-500/30 p-3 rounded">
          <h4 className="text-emerald-400 font-semibold mb-2">
            {finalResult.success ? "Goal Reached!" : "No Path Found"}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="block text-slate-500 text-xs">Path Length</span>
              <span className="font-mono">{finalResult.path.length} steps</span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs">Total Cost</span>
              <span className="font-mono">{finalResult.path_cost.toFixed(1)}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs">Explored</span>
              <span className="font-mono">{finalResult.nodes_explored}</span>
            </div>
            <div>
              <span className="block text-slate-500 text-xs">Time</span>
              <span className="font-mono">{finalResult.execution_time_ms.toFixed(2)} ms</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
