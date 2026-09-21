import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { History as HistoryIcon, Play, Trash2, Search, Activity, Network } from 'lucide-react';
import { useToast } from '../components/ui/ToastContainer';

interface ExperimentHistory {
  id: number;
  algorithm_type: string;
  algorithm_name: string;
  parameters: string;
  result: string;
  created_at: string;
}

const History: React.FC = () => {
  const [history, setHistory] = useState<ExperimentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/history/');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      } else {
        showToast('error', 'History Error', 'Failed to fetch experiment history');
      }
    } catch (e) {
      console.error(e);
      showToast('error', 'Network Error', 'Backend server is unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/api/history/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('success', 'Deleted', 'Experiment deleted successfully.');
        setHistory(prev => prev.filter(item => item.id !== id));
      } else {
        showToast('error', 'Error', 'Failed to delete experiment.');
      }
    } catch (e) {
      showToast('error', 'Network Error', 'Backend server is unavailable.');
    }
  };

  const handleReplay = (item: ExperimentHistory) => {
    // Navigate to the respective lab with the experiment ID
    if (item.algorithm_type === 'search') {
      navigate(`/lab/search?replay=${item.id}`);
    } else if (item.algorithm_type === 'game') {
      navigate(`/lab/game?replay=${item.id}`);
    } else if (item.algorithm_type === 'bayesian') {
      navigate(`/lab/bayesian?replay=${item.id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'search': return <Search className="w-5 h-5 text-blue-400" />;
      case 'game': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'bayesian': return <Network className="w-5 h-5 text-purple-400" />;
      default: return <HistoryIcon className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <HistoryIcon className="w-8 h-8 text-slate-400" />
        Experiment History
      </h1>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">Loading history...</div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No experiments found. Run an algorithm and click "Save Experiment" to see it here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-400 uppercase bg-slate-800/50">
                <tr>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Algorithm</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Metrics</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {history.map((item) => {
                  let parsedResult: any = {};
                  try {
                    parsedResult = JSON.parse(item.result);
                  } catch (e) {}

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 capitalize">
                          {getIcon(item.algorithm_type)}
                          {item.algorithm_type}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-200">
                        {item.algorithm_name}
                      </td>
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {item.algorithm_type === 'search' && parsedResult.cost !== undefined && `Cost: ${parsedResult.cost}`}
                        {item.algorithm_type === 'game' && parsedResult.score !== undefined && `Score: ${parsedResult.score}`}
                        {item.algorithm_type === 'bayesian' && parsedResult.posterior !== undefined && `Posterior: ${(parsedResult.posterior * 100).toFixed(1)}%`}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleReplay(item)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-md transition-colors"
                          >
                            <Play className="w-4 h-4" /> Replay
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-md transition-colors"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
