import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Activity, Network, ArrowRight, Play } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [recent, setRecent] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/history/');
        if (res.ok) {
          const data = await res.json();
          // Sort by newest first and take top 3
          const sorted = data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setRecent(sorted.slice(0, 3));
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchRecent();
  }, []);

  const handleReplay = (item: any) => {
    if (item.algorithm_type === 'search') navigate(`/lab/search?replay=${item.id}`);
    else if (item.algorithm_type === 'game') navigate(`/lab/game?replay=${item.id}`);
    else if (item.algorithm_type === 'bayesian') navigate(`/lab/bayesian?replay=${item.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-bold mb-2">Welcome to Yukti-AI</h1>
      <p className="text-slate-400 mb-10">Your interactive AI laboratory is ready.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-blue-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
            <Search className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Search Intelligence</h2>
          <p className="text-slate-400 flex-1 mb-6">
            Explore pathfinding and uninformed/informed search algorithms like BFS, DFS, and A*.
          </p>
          <Link to="/lab/search" className="flex items-center text-blue-400 hover:text-blue-300 font-medium">
            Open Lab <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Game Intelligence</h2>
          <p className="text-slate-400 flex-1 mb-6">
            Analyze adversarial search algorithms like Minimax and Alpha-Beta pruning.
          </p>
          <Link to="/lab/game" className="flex items-center text-emerald-400 hover:text-emerald-300 font-medium">
            Open Lab <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 hover:border-purple-500/50 transition-colors flex flex-col">
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
            <Network className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Probabilistic Intelligence</h2>
          <p className="text-slate-400 flex-1 mb-6">
            Understand decision making under uncertainty with Bayesian Networks and MDPs.
          </p>
          <Link to="/lab/bayesian" className="flex items-center text-purple-400 hover:text-purple-300 font-medium">
            Open Lab <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>

      <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
        <h2 className="text-xl font-semibold mb-4">Recent Experiments</h2>
        {recent.length === 0 ? (
          <div className="text-center text-slate-500 py-8">
            <p>No recent experiments found.</p>
            <p className="text-sm mt-2">Run an algorithm in one of the labs and save it to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map(item => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-900 px-2 py-0.5 rounded">
                      {item.algorithm_type}
                    </span>
                    <span className="font-semibold text-white">{item.algorithm_name}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(item.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => handleReplay(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md transition-colors text-sm font-medium"
                >
                  <Play className="w-4 h-4" /> Replay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
