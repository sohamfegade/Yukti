import React, { useState, useEffect } from 'react';
import TicTacToeBoard from '../components/game/TicTacToeBoard';
import SceneWrapper from '../components/3d/SceneWrapper';
import ThinkingPanel from '../components/game/ThinkingPanel';
import { useSearchParams } from 'react-router-dom';
import GameTreeVisualizer from '../components/3d/GameTreeVisualizer';
import GameComparisonCharts from '../components/game/GameComparisonCharts';
import { useToast } from '../components/ui/ToastContainer';
import { Gamepad2, Users, Bot, RefreshCw, Save, Activity } from 'lucide-react';

type Player = "X" | "O" | "";

const INITIAL_BOARD: Player[] = Array(9).fill("");

const GameLab: React.FC = () => {
  const [board, setBoard] = useState<Player[]>(INITIAL_BOARD);
  const [isXNext, setIsXNext] = useState<boolean>(true);
  const [gameMode, setGameMode] = useState<'PvE' | 'EvE' | 'PvP'>('PvE');
  const [algorithm, setAlgorithm] = useState<'MINIMAX' | 'ALPHABETA'>('ALPHABETA');
  const [difficulty, setDifficulty] = useState<number>(9);
  
  const { showToast } = useToast();
  
  const [isThinking, setIsThinking] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [compareResults, setCompareResults] = useState<any[] | null>(null);
  
  const [treeData, setTreeData] = useState<any>(null);
  const [metrics, setMetrics] = useState({
    evaluated: 0,
    pruned: 0,
    score: 0,
    bestMove: -1
  });

  const [searchParams] = useSearchParams();
  const replayId = searchParams.get('replay');

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
              setAlgorithm(exp.algorithm_name as 'MINIMAX' | 'ALPHABETA');
              setDifficulty(params.difficulty || 9);
              setGameMode('EvE'); // Force replay mode
              setTreeData(result.tree);
              setMetrics({
                evaluated: result.evaluated,
                pruned: result.pruned,
                score: result.score,
                bestMove: result.bestMove
              });
              setBoard(result.board || INITIAL_BOARD);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchReplay();
    }
  }, [replayId]);

  const checkWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: lines[i] };
      }
    }
    if (!squares.includes("")) return { winner: "Draw", line: [] };
    return null;
  };

  const winState = checkWinner(board);

  const makeAIMove = async (currentBoard: Player[], playerType: "X" | "O") => {
    if (checkWinner(currentBoard)) return;
    
    setIsThinking(true);
    try {
      const res = await fetch('http://localhost:8000/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: currentBoard,
          player: playerType,
          algorithm: algorithm,
          max_depth: difficulty
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMetrics({
          evaluated: data.nodes_evaluated,
          pruned: data.nodes_pruned,
          score: data.score,
          bestMove: data.best_move
        });
        setTreeData(data.tree);
        
        if (data.best_move !== -1) {
          const newBoard = [...currentBoard];
          newBoard[data.best_move] = playerType;
          setBoard(newBoard);
          setIsXNext(playerType === "O"); // Next is opposite
        }
      } else {
        showToast('error', 'AI Engine Error', data.detail || 'Failed to compute move');
      }
    } catch (e) {
      console.error("AI Error:", e);
      showToast('error', 'Network Error', 'Backend server is unavailable or disconnected.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || winState || isThinking) return;

    const newBoard = [...board];
    const currentPlayer = isXNext ? "X" : "O";
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    setIsXNext(!isXNext);

    // Trigger AI response if playing vs AI
    if (gameMode === 'PvE' && !checkWinner(newBoard)) {
      makeAIMove(newBoard, "O");
    }
  };

  const startEvEMatch = async () => {
    setBoard(INITIAL_BOARD);
    setTreeData(null);
    setIsXNext(true);
    let currentBoard = INITIAL_BOARD;
    let turn: "X" | "O" = "X";
    
    while (!checkWinner(currentBoard)) {
      setIsThinking(true);
      const res = await fetch('http://localhost:8000/api/game/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          board: currentBoard,
          player: turn,
          algorithm: algorithm,
          max_depth: difficulty
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        showToast('error', 'AI Engine Error', data.detail || 'Failed to compute move');
        break;
      }
      if (data.best_move === -1) break;
      
      setMetrics({
        evaluated: data.nodes_evaluated,
        pruned: data.nodes_pruned,
        score: data.score,
        bestMove: data.best_move
      });
      setTreeData(data.tree);
      
      const newBoard = [...currentBoard];
      newBoard[data.best_move] = turn;
      currentBoard = newBoard;
      setBoard(currentBoard);
      turn = turn === "X" ? "O" : "X";
      setIsXNext(turn === "X");
      
      // Delay for UI visualization
      await new Promise(r => setTimeout(r, 1000));
    }
    setIsThinking(false);
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setIsXNext(true);
    setTreeData(null);
  };
  const saveExperiment = async () => {
    if (!treeData) return;
    try {
      const payload = {
        algorithm_type: 'game',
        algorithm_name: algorithm,
        parameters: JSON.stringify({ difficulty, mode: gameMode }),
        result: JSON.stringify({
          tree: treeData,
          evaluated: metrics.evaluated,
          pruned: metrics.pruned,
          score: metrics.score,
          bestMove: metrics.bestMove,
          board: board
        })
      };
      const res = await fetch('http://localhost:8000/api/history/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('success', 'Saved!', 'Game experiment saved to history.');
      } else {
        showToast('error', 'Error', 'Failed to save experiment.');
      }
    } catch (e) {
      showToast('error', 'Network Error', 'Backend server is unavailable.');
    }
  };

  const runCompare = async () => {
    setIsComparing(true);
    setCompareResults(null);
    try {
      const results = [];
      const algorithms: ("MINIMAX" | "ALPHABETA")[] = ["MINIMAX", "ALPHABETA"];
      
      for (const algo of algorithms) {
        const startTime = performance.now();
        const res = await fetch('http://localhost:8000/api/game/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ board, player: "X", algorithm: algo, max_depth: difficulty })
        });
        const data = await res.json();
        const endTime = performance.now();
        
        if (res.ok) {
          results.push({
            algorithm: algo,
            nodes_evaluated: data.nodes_evaluated,
            nodes_pruned: data.nodes_pruned,
            time_ms: endTime - startTime
          });
        }
      }
      setCompareResults(results);
    } catch (e) {
      showToast('error', 'Comparison Error', 'Failed to run comparison.');
      setIsComparing(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar Controls */}
      <div className="w-full md:w-96 border-r border-slate-700 bg-slate-900/50 backdrop-blur p-4 overflow-y-auto flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-indigo-400" />
            Game Intelligence
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Game Mode</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => { setGameMode('PvE'); setBoard(INITIAL_BOARD); setTreeData(null); }}
                  className={`flex-1 py-2 px-2 rounded flex flex-col items-center gap-1 transition-colors ${gameMode === 'PvE' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <Users className="w-4 h-4" /> <span className="text-xs">Human vs AI</span>
                </button>
                <button 
                  onClick={() => { setGameMode('EvE'); setBoard(INITIAL_BOARD); setTreeData(null); }}
                  className={`flex-1 py-2 px-2 rounded flex flex-col items-center gap-1 transition-colors ${gameMode === 'EvE' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <Bot className="w-4 h-4" /> <span className="text-xs">AI vs AI</span>
                </button>
                <button 
                  onClick={() => { setGameMode('PvP'); setBoard(INITIAL_BOARD); setTreeData(null); }}
                  className={`flex-1 py-2 px-2 rounded flex flex-col items-center gap-1 transition-colors ${gameMode === 'PvP' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                >
                  <Users className="w-4 h-4" /> <span className="text-xs">Local PvP</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Algorithm</label>
              <select 
                value={algorithm}
                onChange={e => setAlgorithm(e.target.value as 'MINIMAX' | 'ALPHABETA')}
                className="w-full bg-slate-800 border border-slate-700 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-indigo-500 text-white"
              >
                <option value="MINIMAX">Standard Minimax</option>
                <option value="ALPHABETA">Alpha-Beta Pruning</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">AI Depth Limit (Difficulty)</label>
              <input 
                type="range" min="1" max="9" 
                value={difficulty}
                onChange={e => setDifficulty(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Fast/Weak (1)</span>
                <span>Perfect (9)</span>
              </div>
            </div>

            {gameMode === 'EvE' && (
              <div className="flex gap-2">
                <button 
                  onClick={startEvEMatch}
                  disabled={isThinking || !!winState}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5" /> Start Auto-Match
                </button>
                <button 
                  onClick={saveExperiment}
                  disabled={isThinking || !treeData}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center"
                  title="Save Experiment"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            )}

            {gameMode !== 'EvE' && (
              <button 
                onClick={saveExperiment}
                disabled={isThinking || !treeData}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save Experiment
              </button>
            )}

            <div className="flex gap-2">
              <button 
                onClick={resetGame}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 border border-slate-700"
              >
                <RefreshCw className="w-4 h-4" /> Reset Board
              </button>
              <button 
                onClick={runCompare}
                disabled={isThinking || !!winState}
                className="w-full bg-amber-600/20 hover:bg-amber-600/40 text-amber-500 font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 border border-amber-600/50"
              >
                <Activity className="w-4 h-4" /> Compare
              </button>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <ThinkingPanel 
            algorithm={algorithm === 'ALPHABETA' ? 'Alpha-Beta Pruning' : 'Standard Minimax'}
            nodesEvaluated={metrics.evaluated}
            nodesPruned={metrics.pruned}
            score={metrics.score}
            bestMove={metrics.bestMove}
            isThinking={isThinking}
          />
        </div>
      </div>

      {/* Main Play Area */}
      <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden relative">
        {isComparing ? (
          <div className="absolute inset-0 z-20 bg-slate-900/95 overflow-y-auto p-4 md:p-8">
            <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Algorithm Comparison</h2>
              <button 
                onClick={() => setIsComparing(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded transition-colors"
              >
                Close Comparison
              </button>
            </div>
            
            {compareResults ? (
              <GameComparisonCharts results={compareResults} />
            ) : (
              <div className="flex items-center justify-center h-64">
                <div className="text-xl text-slate-400 animate-pulse flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 animate-spin" /> Running algorithms...
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* 3D Visualizer Area */}
        <div className="flex-1 flex items-center justify-center bg-slate-950 p-4 border-b border-slate-800">
          <div className="flex flex-col items-center">
            <div className="mb-6 h-8 flex items-center">
              {winState ? (
                <div className={`text-2xl font-bold ${winState.winner === 'X' ? 'text-blue-500' : winState.winner === 'O' ? 'text-emerald-500' : 'text-slate-400'}`}>
                  {winState.winner === "Draw" ? "It's a Draw!" : `${winState.winner} Wins!`}
                </div>
              ) : (
                <div className="text-xl text-slate-300 font-medium">
                  Current Turn: <span className={isXNext ? 'text-blue-500' : 'text-emerald-500'}>{isXNext ? 'X' : 'O'}</span>
                </div>
              )}
            </div>
            
            <TicTacToeBoard 
              board={board} 
              onCellClick={handleCellClick} 
              disabled={isThinking || !!winState || (gameMode === 'PvE' && !isXNext) || gameMode === 'EvE'}
              winningLine={winState ? winState.line : []}
            />
          </div>
        </div>
        
        {/* Bottom: 3D Tree Visualization */}
        <div className="flex-1 bg-slate-900 relative">
          <div className="absolute top-2 left-4 z-10 bg-slate-900/80 p-2 rounded text-xs text-slate-400 font-mono border border-slate-800 backdrop-blur">
            Generated Game Tree Visualization (Depth limited to 3 for performance)
          </div>
          <div className="w-full h-full">
            <SceneWrapper controls={true}>
              {treeData && <GameTreeVisualizer tree={treeData} maxRenderDepth={3} />}
            </SceneWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLab;
