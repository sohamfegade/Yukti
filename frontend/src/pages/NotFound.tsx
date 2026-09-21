import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-6xl font-extrabold text-slate-700 mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Lab Not Found</h2>
      <p className="text-slate-400 max-w-md mb-8">
        The experiment or page you are looking for does not exist or has been moved.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-md font-medium transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Safety
      </Link>
    </div>
  );
};

export default NotFound;
