import React from 'react';

interface ProbabilityControlsProps {
  prior: number;
  setPrior: (val: number) => void;
  tpr: number;
  setTpr: (val: number) => void;
  fpr: number;
  setFpr: (val: number) => void;
  evidenceObserved: boolean;
  setEvidenceObserved: (val: boolean) => void;
}

const ProbabilityControls: React.FC<ProbabilityControlsProps> = ({
  prior, setPrior, tpr, setTpr, fpr, setFpr, evidenceObserved, setEvidenceObserved
}) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-5 shadow-xl space-y-6">
      
      <div>
        <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
          <span>Prior Probability P(Condition)</span>
          <span className="text-blue-400 font-mono">{(prior * 100).toFixed(1)}%</span>
        </label>
        <input 
          type="range" min="0" max="100" step="0.1"
          value={prior * 100}
          onChange={(e) => setPrior(parseFloat(e.target.value) / 100)}
          className="w-full accent-blue-500"
        />
        <p className="text-xs text-slate-500 mt-1">Base rate of the condition in the population</p>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
          <span>True Positive Rate P(Evidence|Condition)</span>
          <span className="text-emerald-400 font-mono">{(tpr * 100).toFixed(1)}%</span>
        </label>
        <input 
          type="range" min="0" max="100" step="0.1"
          value={tpr * 100}
          onChange={(e) => setTpr(parseFloat(e.target.value) / 100)}
          className="w-full accent-emerald-500"
        />
        <p className="text-xs text-slate-500 mt-1">Sensitivity: Likelihood of seeing evidence if condition is true</p>
      </div>

      <div>
        <label className="flex justify-between text-sm font-medium text-slate-300 mb-2">
          <span>False Positive Rate P(Evidence|~Condition)</span>
          <span className="text-amber-400 font-mono">{(fpr * 100).toFixed(1)}%</span>
        </label>
        <input 
          type="range" min="0" max="100" step="0.1"
          value={fpr * 100}
          onChange={(e) => setFpr(parseFloat(e.target.value) / 100)}
          className="w-full accent-amber-500"
        />
        <p className="text-xs text-slate-500 mt-1">Fall-out: Likelihood of seeing evidence if condition is false</p>
      </div>

      <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-slate-300">Evidence Observation</h4>
          <p className="text-xs text-slate-500">Did the event/evidence occur?</p>
        </div>
        
        <button
          onClick={() => setEvidenceObserved(!evidenceObserved)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${evidenceObserved ? 'bg-indigo-500' : 'bg-slate-700'}`}
        >
          <span 
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${evidenceObserved ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>
      
    </div>
  );
};

export default ProbabilityControls;
