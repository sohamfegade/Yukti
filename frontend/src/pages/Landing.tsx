import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Activity, Network } from 'lucide-react';
import SceneWrapper from '../components/3d/SceneWrapper';
import BackgroundNodes from '../components/3d/BackgroundNodes';

const Landing: React.FC = () => {
  return (
    <div className="relative flex-1 flex flex-col justify-center min-h-[calc(100vh-4rem)]">
      <SceneWrapper>
        <BackgroundNodes />
      </SceneWrapper>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            See AI Think.
          </span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300 mb-12">
          An interactive laboratory to explore, trace, and understand how artificial intelligence algorithms search, reason, and make decisions in real-time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/lab/search" 
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
          >
            <Search className="w-5 h-5" />
            Explore Search AI
          </Link>
          <Link 
            to="/lab/game" 
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <Activity className="w-5 h-5" />
            Explore Game AI
          </Link>
          <Link 
            to="/lab/bayesian" 
            className="flex items-center justify-center gap-2 px-8 py-4 text-base font-medium rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <Network className="w-5 h-5" />
            Explore Probabilistic AI
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
