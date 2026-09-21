import React, { useState, useEffect, useRef } from 'react';
import SceneWrapper from '../components/3d/SceneWrapper';
import GridEditor from '../components/search/GridEditor';
import type { GridState, PaintMode } from '../components/search/GridEditor';
import { useSearchParams } from 'react-router-dom';
import PlaybackControls from '../components/search/PlaybackControls';
import MetricsPanel from '../components/search/MetricsPanel';
import Search3DVisualizer from '../components/3d/Search3DVisualizer';
import SearchComparisonCharts from '../components/search/SearchComparisonCharts';
import { useToast } from '../components/ui/ToastContainer';
import { PenTool, Eraser, Move, Target, Weight, Play, Save } from 'lucide-react';

const INITIAL_GRID: GridState = {
  width: 20,
  height: 15,
  start: [2, 7],
  goal: [17, 7],
  obstacles: [],
  weights: {}
};

const SearchLab: React.FC = () => {
  const [grid, setGrid] = useState<GridState>(INITIAL_GRID);
  const [paintMode, setPaintMode] = useState<PaintMode>('obstacle');
  const [algorithm, setAlgorithm] = useState<string>('BFS');
  const [heuristic, setHeuristic] = useState<string>('manhattan');
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  
  const [trace, setTrace] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [isComparing, setIsComparing] = useState(false);
  const [compareResults, setCompareResults] = useState<any>(null);

  const [searchState, setSearchState] = useState<{
    path: [number, number][];
    explored: [number, number][];
    steps: any[];
    cost: number;
  }>({
    path: [],
    explored: [],
    steps: [],
    cost: 0
  });

  const timerRef = useRef<number | null>(null);
  const { showToast } = useToast();

  const [searchParams] = useSearchParams();
  const replayId = searchParams.get('replay');

  // If replaying, fetch the experiment data once
  useEffect(() => {
    if (replayId) {
      const fetchReplay = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/history/`);
          if (res.ok) {
            const data = await res.json();
      const exp = data.find((item: any) => item.id === parseInt(replayId));
      if (exp) {
        const params = JSON.parse(exp.parameters);
        const result = JSON.parse(exp.result);
        setAlgorithm(exp.algorithm_name.toUpperCase());
        setGrid(params.grid);
        setSearchState({
          path: result.path,
          explored: result.explored,
          steps: result.steps,
          cost: result.cost
        });
        setCurrentStepIndex(result.steps.length - 1);
      }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchReplay();
    }
  }, [replayId]);

  const runAlgorithm = async () => {
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentStepIndex(-1);
    setTrace([]);
    setResult(null);
    
    try {
      const res = await fetch('http://localhost:8000/api/search/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid,
          algorithm,
          heuristic
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setTrace(data.trace);
        setResult(data.result);
        setCurrentStepIndex(0);
        setIsPlaying(true);
      } else {
        showToast('error', 'Search Error', data.detail || 'Error running algorithm');
      }
    } catch (e) {
      showToast('error', 'Connection Error', 'Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isPlaying && currentStepIndex < trace.length - 1) {
      timerRef.current = window.setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, 500 / speed);
    } else if (isPlaying && currentStepIndex >= trace.length - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStepIndex, trace.length, speed]);

  const handlePlayPause = () => {
    if (currentStepIndex >= trace.length - 1 && !isPlaying) {
      setCurrentStepIndex(0); // restart if at end
    }
    setIsPlaying(!isPlaying);
  };

  const handleStep = () => {
    if (currentStepIndex < trace.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleClearGrid = () => {
    setGrid(prev => ({ ...prev, obstacles: [], weights: {} }));
    setTrace([]);
    setResult(null);
    setCurrentStepIndex(-1);
  };

  const currentTraceStep = trace.length > 0 && currentStepIndex >= 0 ? trace[currentStepIndex] : undefined;
  const isFinished = currentStepIndex === trace.length - 1;


  const runCompare = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/search/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grid,
          algorithms: ['BFS', 'DFS', 'UCS', 'GREEDY', 'ASTAR']
        })
      });
      const data = await res.json();
      if (res.ok) {
        setCompareResults(data.results);
        setIsComparing(true);
      } else {
        alert('Error comparing algorithms');
      }
    } catch (e) {
      alert('Failed to connect to backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveExperiment = async () => {
    if (searchState.steps.length === 0) return;
    try {
      const payload = {
        algorithm_type: 'search',
        algorithm_name: algorithm.toUpperCase(),
        parameters: JSON.stringify({ grid }),
        result: JSON.stringify(searchState)
      };
      const res = await fetch('http://localhost:8000/api/history/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('success', 'Saved!', 'Experiment saved to history.');
      } else {
        showToast('error', 'Error', 'Failed to save experiment.');
      }
    } catch (e) {
      showToast('error', 'Network Error', 'Backend server is unavailable.');
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Left Sidebar - Controls */}
      <div className="w-full md:w-80 border-r border-slate-700 bg-slate-900/50 backdrop-blur p-4 overflow-y-auto flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 text-white">Search Intelligence</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Algorithm</label>
              <select 
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500 text-white"
              >
                <option value="BFS">Breadth-First Search (BFS)</option>
                <option value="DFS">Depth-First Search (DFS)</option>
                <option value="UCS">Uniform Cost Search (UCS)</option>
                <option value="GREEDY">Greedy Best-First</option>
                <option value="ASTAR">A* Search</option>
              </select>
            </div>
            
            {(algorithm === 'ASTAR' || algorithm === 'GREEDY') && (
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Heuristic</label>
                <select 
                  value={heuristic}
                  onChange={e => setHeuristic(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-blue-500 text-white"
                >
                  <option value="manhattan">Manhattan Distance</option>
                  <option value="euclidean">Euclidean Distance</option>
                </select>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2">
              <div className="flex gap-2">
                <button 
                  onClick={runAlgorithm}
                  disabled={isLoading || isPlaying}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Run {algorithm.toUpperCase()}
                </button>
                <button 
                  onClick={saveExperiment}
                  disabled={isLoading || isPlaying || searchState.steps.length === 0}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                  title="Save Experiment"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
              <button 
                onClick={runCompare}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              >
                {isLoading && isComparing ? 'Running...' : 'Compare All'}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Grid Tools</h3>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={() => setPaintMode('start')} className={`flex items-center gap-2 p-2 rounded ${paintMode === 'start' ? 'bg-blue-600' : 'bg-slate-800 hover:bg-slate-700'} text-xs text-white`}>
              <Move className="w-4 h-4" /> Start
            </button>
            <button onClick={() => setPaintMode('goal')} className={`flex items-center gap-2 p-2 rounded ${paintMode === 'goal' ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-700'} text-xs text-white`}>
              <Target className="w-4 h-4" /> Goal
            </button>
            <button onClick={() => setPaintMode('obstacle')} className={`flex items-center gap-2 p-2 rounded ${paintMode === 'obstacle' ? 'bg-slate-500' : 'bg-slate-800 hover:bg-slate-700'} text-xs text-white`}>
              <PenTool className="w-4 h-4" /> Wall
            </button>
            <button onClick={() => setPaintMode('weight')} className={`flex items-center gap-2 p-2 rounded ${paintMode === 'weight' ? 'bg-amber-600' : 'bg-slate-800 hover:bg-slate-700'} text-xs text-white`}>
              <Weight className="w-4 h-4" /> Weight
            </button>
            <button onClick={() => setPaintMode('erase')} className={`flex items-center gap-2 p-2 rounded ${paintMode === 'erase' ? 'bg-red-600' : 'bg-slate-800 hover:bg-slate-700'} text-xs text-white col-span-2 justify-center`}>
              <Eraser className="w-4 h-4" /> Erase
            </button>
          </div>
          <button onClick={handleClearGrid} className="w-full text-slate-400 hover:text-white text-sm py-1 border border-slate-700 rounded transition-colors">
            Clear All
          </button>
        </div>

        <div className="mt-auto">
          {!isComparing && (
            <MetricsPanel 
              currentStep={currentTraceStep} 
              finalResult={isFinished ? result : undefined} 
              algorithm={algorithm} 
            />
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 relative bg-slate-950 flex flex-col overflow-hidden">
        
        {/* View Toggle */}
        <div className="absolute top-4 right-4 z-20 flex bg-slate-800 p-1 rounded-lg border border-slate-700 shadow-xl">
          <button 
            onClick={() => { setViewMode('2d'); setIsComparing(false); }} 
            className={`px-4 py-1 rounded text-sm font-medium transition-colors ${viewMode === '2d' && !isComparing ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            2D View
          </button>
          <button 
            onClick={() => { setViewMode('3d'); setIsComparing(false); }} 
            className={`px-4 py-1 rounded text-sm font-medium transition-colors ${viewMode === '3d' && !isComparing ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            3D View
          </button>
          {isComparing && (
            <button 
              className={`px-4 py-1 rounded text-sm font-medium transition-colors bg-indigo-600 text-white ml-2`}
            >
              Compare Mode
            </button>
          )}
        </div>

        {/* Visualizer Area */}
        <div className="flex-1 relative flex items-center justify-center p-4">
          {isComparing && compareResults ? (
            <div className="absolute inset-0 z-20 bg-slate-900/95 overflow-y-auto p-4 md:p-8">
              <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Comparison Results</h2>
                <button 
                  onClick={() => setIsComparing(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Close Comparison
                </button>
              </div>
              
              {compareResults && <SearchComparisonCharts results={compareResults} />}
            </div>
          ) : viewMode === '2d' ? (
            <div className="overflow-auto max-h-full max-w-full flex items-center justify-center relative z-10">
              <GridEditor 
                grid={grid} 
                onChange={setGrid} 
                paintMode={paintMode} 
                readOnly={trace.length > 0} 
              />
              
              {/* Overlay active trace for 2D */}
              {currentTraceStep && (
                <div 
                  className="absolute inset-0 pointer-events-none" 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${grid.width}, minmax(0, 1fr))`,
                    width: 'max-content',
                    height: 'max-content',
                    margin: 'auto',
                    gap: '1px'
                  }}
                >
                  {Array.from({ length: grid.height }).map((_, y) => 
                    Array.from({ length: grid.width }).map((_, x) => {
                      const isS = grid.start[0] === x && grid.start[1] === y;
                      const isG = grid.goal[0] === x && grid.goal[1] === y;
                      
                      const visited = currentTraceStep.visited.some((v: any) => v[0] === x && v[1] === y);
                      const frontier = currentTraceStep.frontier.some((f: any) => f[0] === x && f[1] === y);
                      const current = currentTraceStep.current_node && currentTraceStep.current_node[0] === x && currentTraceStep.current_node[1] === y;
                      const inPath = isFinished && result?.path?.some((p: any) => p[0] === x && p[1] === y);
                      
                      let overlayClass = "";
                      if (inPath && !isS && !isG) overlayClass = "bg-yellow-400/80 animate-pulse";
                      else if (current) overlayClass = "bg-red-500/80 scale-90 rounded-sm shadow-[0_0_10px_rgba(239,68,68,0.8)]";
                      else if (frontier) overlayClass = "bg-violet-500/60 scale-75 rounded-sm";
                      else if (visited && !isS && !isG) overlayClass = "bg-slate-600/60";

                      return (
                        <div key={`overlay-${x}-${y}`} className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-300 ${overlayClass}`} />
                      );
                    })
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="absolute inset-0 z-0">
              <SceneWrapper controls={true}>
                <Search3DVisualizer 
                  grid={grid} 
                  currentStep={currentTraceStep} 
                  path={isFinished ? result?.path : undefined} 
                />
              </SceneWrapper>
            </div>
          )}
        </div>

        {/* Playback Controls */}
        {!isComparing && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 shadow-2xl">
            <PlaybackControls 
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onStep={handleStep}
              onReset={handleReset}
              speed={speed}
              onSpeedChange={setSpeed}
              disabled={trace.length === 0}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchLab;
