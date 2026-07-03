import React, { useEffect, useState, useRef } from 'react';
import { Camera, Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

const CameraFeed = ({ camera }) => {
  const [hasEvent, setHasEvent] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    // Randomly trigger mock events for visual effect
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        setHasEvent(true);
        setTimeout(() => setHasEvent(false), 3000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-700/50 group">
      {/* Mock Video Stream */}
      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
        {camera.status === 'active' ? (
          <div className="relative w-full h-full bg-slate-800">
            {/* CSS Animation Mocking a Camera Loop */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
            <div className="absolute top-0 w-full h-1 bg-blue-500/30 blur-sm animate-[scan_4s_ease-in-out_infinite]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <Camera className="w-16 h-16 text-slate-700" />
            </div>
          </div>
        ) : (
          <div className="text-slate-600 flex flex-col items-center">
            <Activity className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-sm font-medium uppercase tracking-wider">Feed Offline</span>
          </div>
        )}
      </div>

      {/* CV Bounding Box Mock */}
      {hasEvent && camera.status === 'active' && (
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/2 border-2 border-red-500 bg-red-500/10 rounded pointer-events-none transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]">
          <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-t uppercase tracking-wider">
            Person detected: 98%
          </div>
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-white font-medium text-sm flex items-center gap-2">
            {camera.status === 'active' && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
            {camera.name}
          </span>
          <span className="text-slate-400 text-xs">{camera.location}</span>
        </div>
        {hasEvent && (
          <span className="bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold animate-pulse">
            Alert
          </span>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
