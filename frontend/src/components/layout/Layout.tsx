import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Beaker, Search, Activity, Share2, History, BookOpen, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Activity className="w-4 h-4" /> },
    { name: 'Search', path: '/lab/search', icon: <Search className="w-4 h-4" /> },
    { name: 'Game', path: '/lab/game', icon: <Share2 className="w-4 h-4" /> },
    { name: 'Bayesian', path: '/lab/bayesian', icon: <Beaker className="w-4 h-4" /> },
    { name: 'History', path: '/history', icon: <History className="w-4 h-4" /> },
    { name: 'Learn', path: '/learn', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
                  <Beaker className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">Yukti AI</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex text-sm text-slate-400 border border-slate-700 px-3 py-1 rounded-full items-center gap-2 bg-slate-800/30">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                Lab Online
              </div>
              <button 
                className="md:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
