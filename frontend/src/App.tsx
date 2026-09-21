import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/ui/ToastContainer';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import SearchLab from './pages/SearchLab';
import GameLab from './pages/GameLab';
import ProbabilisticLab from './pages/ProbabilisticLab';
import History from './pages/History';
import Learn from './pages/Learn';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="lab/search" element={<SearchLab />} />
            <Route path="lab/game" element={<GameLab />} />
            <Route path="lab/bayesian" element={<ProbabilisticLab />} />
            <Route path="history" element={<History />} />
            <Route path="learn" element={<Learn />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;
