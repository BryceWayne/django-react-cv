import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCameras, fetchEvents, logout } from '../api';
import CameraFeed from '../components/CameraFeed';
import EventLog from '../components/EventLog';
import { Shield, LayoutDashboard, Settings, LogOut } from 'lucide-react';

const Dashboard = () => {
  const [cameras, setCameras] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [camData, evtData] = await Promise.all([
          fetchCameras(),
          fetchEvents()
        ]);
        setCameras(camData);
        setEvents(evtData);
      } catch (err) {
        console.error("Failed to fetch data", err);
        if (err.message.includes('401') || err.message === 'Failed to fetch') {
          handleLogout();
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
    
    // Polling mock
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Shield className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-display font-bold text-white tracking-wide">Sentinel CV</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 text-blue-400 rounded-lg border border-blue-500/20">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </a>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 gap-6 h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        <header className="flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-display font-semibold text-white">Live Operations</h2>
            <p className="text-slate-400 text-sm mt-1">Monitoring {cameras.length} camera feeds in real-time</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-green-400">System Nominal</span>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
          {/* Camera Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-fr h-full overflow-y-auto pr-2 pb-4">
            {cameras.map(camera => (
              <CameraFeed key={camera.id} camera={camera} />
            ))}
          </div>

          {/* Event Log */}
          <div className="h-full pb-4">
            <EventLog events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
