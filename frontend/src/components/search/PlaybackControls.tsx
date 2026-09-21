import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, FastForward } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onStep: () => void;
  onReset: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying, onPlayPause, onStep, onReset, speed, onSpeedChange, disabled = false
}) => {
  return (
    <div className="flex items-center gap-4 bg-slate-800 p-3 rounded-lg border border-slate-700">
      <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
        <button
          onClick={onPlayPause}
          disabled={disabled}
          className="p-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={onStep}
          disabled={disabled || isPlaying}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Step Forward"
        >
          <SkipForward className="w-5 h-5" />
        </button>
        <button
          onClick={onReset}
          disabled={disabled}
          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Reset Execution"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex items-center gap-2">
        <FastForward className="w-4 h-4 text-slate-400" />
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={disabled}
          className="bg-slate-900 border border-slate-700 text-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
        >
          <option value={0.5}>0.5x</option>
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
          <option value={10}>10x</option>
        </select>
      </div>
    </div>
  );
};

export default PlaybackControls;
