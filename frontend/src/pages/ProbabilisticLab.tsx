import React, { useState, useEffect, useCallback } from 'react';
import ProbabilityControls from '../components/bayesian/ProbabilityControls';
import BayesianCharts from '../components/bayesian/BayesianCharts';
import SceneWrapper from '../components/3d/SceneWrapper';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../components/ui/ToastContainer';
import BayesianNetworkVisualizer from '../components/3d/BayesianNetworkVisualizer';
import { Network, FileWarning, Save } from 'lucide-react';

const ProbabilisticLab: React.FC = () => {
  const [prior, setPrior] = useState<number>(0.01);
  const [tpr, setTpr] = useState<number>(0.90);
  const [fpr, setFpr] = useState<number>(0.09);
  const [evidenceObserved, setEvidenceObserved] = useState<boolean>(true);
  
  const [posterior, setPosterior] = useState<number>(0);
  const [calculationSteps, setCalculationSteps] = useState<string[]>([]);
  const [network, setNetwork] = useState<any>(null);
  
  const { showToast } = useToast();

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
              setPrior(params.prior || 0.01);
              setTpr(params.tpr || 0.9);
              setFpr(params.fpr || 0.05);
              setEvidenceObserved(params.evidenceObserved !== undefined ? params.evidenceObserved : true);
              setPosterior(result.posterior);
              setCalculationSteps(result.steps || result.calculation_steps || []);
              setNetwork(result.network);
            }
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchReplay();
    }
  }, [replayId]);

  const calculateInference = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:8000/api/bayesian/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prior,
          true_positive_rate: tpr,
          false_positive_rate: fpr,
          evidence_observed: evidenceObserved
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setPosterior(data.posterior);
        setCalculationSteps(data.calculation_steps);
        setNetwork(data.network);
      } else {
        showToast('error', 'Inference Error', data.detail || 'Failed to compute probability');
      }
    } catch (e) {
      console.error("Bayesian API Error:", e);
      showToast('error', 'Network Error', 'Backend server is unavailable or disconnected.');
    }
  }, [prior, tpr, fpr, evidenceObserved]);

  // Recalculate whenever inputs change
  useEffect(() => {
    calculateInference();
  }, [calculateInference, replayId]);

  const saveExperiment = async () => {
    if (!network) return;
    try {
      const payload = {
        algorithm_type: 'bayesian',
        algorithm_name: 'BAYES_THEOREM',
        parameters: JSON.stringify({ prior, tpr, fpr, evidenceObserved }),
        result: JSON.stringify({
          posterior: posterior,
          steps: calculationSteps,
          network: network
        })
      };
      const res = await fetch('http://localhost:8000/api/history/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showToast('success', 'Saved!', 'Bayesian experiment saved to history.');
      } else {
        showToast('error', 'Error', 'Failed to save experiment.');
      }
    } catch (e) {
      showToast('error', 'Network Error', 'Backend server is unavailable.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 md:p-6 gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-indigo-900/50 p-2 rounded-lg border border-indigo-700/50">
          <Network className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Probabilistic Intelligence</h1>
          <p className="text-sm text-slate-400">Bayesian Reasoning & Inference Engine</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Controls */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ProbabilityControls 
            prior={prior} setPrior={setPrior}
            tpr={tpr} setTpr={setTpr}
            fpr={fpr} setFpr={setFpr}
            evidenceObserved={evidenceObserved} setEvidenceObserved={setEvidenceObserved}
          />
          <button 
            onClick={saveExperiment}
            disabled={!network}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Experiment
          </button>
          
          <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2 mb-3">
              <FileWarning className="w-4 h-4 text-slate-400" />
              Scenario Context
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-2">
              Imagine a scenario where we are testing for a rare condition:
            </p>
            <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
              <li><strong>Condition</strong>: Affects {(prior * 100).toFixed(1)}% of the population.</li>
              <li><strong>Test Accuracy</strong>: Properly detects the condition {(tpr * 100).toFixed(1)}% of the time.</li>
              <li><strong>False Alarm</strong>: Falsely flags healthy individuals {(fpr * 100).toFixed(1)}% of the time.</li>
            </ul>
            <p className="text-xs text-slate-400 mt-2">
              If a person {evidenceObserved ? 'tests positive' : 'tests negative'}, what is the actual probability they have the condition? Adjust sliders to see the Bayes calculation update.
            </p>
          </div>
        </div>

        {/* Middle Column: 3D Visualizer */}
        <div className="lg:col-span-1 bg-slate-900 rounded-lg border border-slate-800 relative overflow-hidden min-h-[400px]">
          <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-bold text-slate-300 bg-slate-950/80 px-2 py-1 rounded border border-slate-800 backdrop-blur">
              Network Flow Topology
            </h3>
          </div>
          <SceneWrapper controls={true}>
            {network && <BayesianNetworkVisualizer network={network} />}
          </SceneWrapper>
        </div>

        {/* Right Column: Charts & Math */}
        <div className="lg:col-span-1">
          <BayesianCharts 
            prior={prior} 
            posterior={posterior} 
            calculationSteps={calculationSteps} 
          />
        </div>

      </div>
    </div>
  );
};

export default ProbabilisticLab;
