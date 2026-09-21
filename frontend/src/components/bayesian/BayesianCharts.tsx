import React from 'react';
import { Calculator, BarChart3, AlertTriangle } from 'lucide-react';

interface BayesianChartsProps {
  prior: number;
  posterior: number;
  calculationSteps: string[];
}

const BayesianCharts: React.FC<BayesianChartsProps> = ({ prior, posterior, calculationSteps }) => {
  return (
    <div className="flex flex-col gap-6 h-full">
      
      {/* Disclaimer */}
      <div className="bg-amber-950/40 border border-amber-800/50 p-4 rounded-lg flex gap-3 items-start">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-amber-400 mb-1">Educational Demonstration Only</h4>
          <p className="text-xs text-amber-200/80 leading-relaxed">
            This module is an educational demonstration of Bayesian reasoning using synthetic data. 
            It is <strong>not a medical diagnostic tool</strong> and should not be used for medical decisions. 
            Real-world probabilities involve complex conditional dependencies not captured here.
          </p>
        </div>
      </div>

      {/* Visual Comparison */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-5 flex-1">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          Probability Shift
        </h3>
        
        <div className="flex items-end justify-center gap-12 h-48 px-4">
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className="text-xl font-mono font-bold text-blue-400">{(prior * 100).toFixed(1)}%</div>
            <div 
              className="w-20 bg-blue-500/80 rounded-t-md transition-all duration-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              style={{ height: `${Math.max(prior * 100, 2)}%` }} // Minimum height for visibility
            ></div>
            <div className="text-sm font-medium text-slate-300">Prior</div>
          </div>
          
          <div className="flex flex-col items-center gap-2 relative">
            <div className="text-xl font-mono font-bold text-fuchsia-400">{(posterior * 100).toFixed(1)}%</div>
            <div 
              className="w-20 bg-fuchsia-500/80 rounded-t-md transition-all duration-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
              style={{ height: `${Math.max(posterior * 100, 2)}%` }}
            ></div>
            <div className="text-sm font-medium text-slate-300">Posterior</div>
          </div>
          
        </div>
      </div>

      {/* Mathematical Breakdown */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg p-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-slate-400" />
          Mathematical Inference
        </h3>
        
        <div className="bg-slate-950 p-4 rounded border border-slate-800 font-mono text-sm overflow-x-auto">
          {calculationSteps.length > 0 ? (
            <div className="space-y-2">
              {calculationSteps.map((step, idx) => (
                <div key={idx} className={`${idx === calculationSteps.length - 1 ? 'text-fuchsia-400 font-bold mt-4 pt-4 border-t border-slate-800' : 'text-slate-400'}`}>
                  {step}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-600 italic">Calculating...</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default BayesianCharts;
