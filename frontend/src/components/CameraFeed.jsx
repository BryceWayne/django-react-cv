import React, { useEffect, useState, useRef } from 'react';
import { Camera, Activity } from 'lucide-react';
import { createEvent } from '../api';

const CameraFeed = ({ camera }) => {
  const [hasEvent, setHasEvent] = useState(false);
  const [bbox, setBbox] = useState({ top: 0, left: 0, width: 0, height: 0, label: '', conf: 0 });
  const videoRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (camera.status === 'active' && Math.random() > 0.6) {
        setHasEvent(true);
        const label = Math.random() > 0.5 ? 'Person' : 'Vehicle';
        const conf = (Math.random() * 15 + 85).toFixed(1);
        
        setBbox({
          top: Math.random() * 50 + 10,
          left: Math.random() * 50 + 10,
          width: Math.random() * 20 + 10,
          height: Math.random() * 30 + 15,
          label: label,
          conf: conf
        });
        
        // Post real event to the backend so it populates the log
        const eventType = label === 'Person' ? 'person_detected' : 'vehicle';
        try {
          await createEvent({
            camera: camera.id,
            event_type: eventType,
            confidence: parseFloat(conf) / 100,
            details: `Detected ${label} with ${conf}% confidence`
          });
        } catch (e) {
          console.error("Failed to post mock event", e);
        }

        setTimeout(() => setHasEvent(false), 2500); // Box stays for 2.5s
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [camera.status, camera.id]);

  return (
    <div className="relative overflow-hidden rounded-xl bg-slate-900 border border-slate-700/50 group h-full min-h-[250px]">
      {camera.status === 'active' ? (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <video 
            ref={videoRef}
            src={camera.stream_url}
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-80 mix-blend-lighten"
          />
          {/* Overlay mock scanline */}
          <div className="absolute top-0 w-full h-1 bg-blue-500/20 blur-sm animate-[scan_4s_ease-in-out_infinite] pointer-events-none"></div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 bg-slate-800">
          <Activity className="w-8 h-8 mb-2 opacity-50" />
          <span className="text-sm font-medium uppercase tracking-wider">Feed Offline</span>
        </div>
      )}

      {/* CV Bounding Box Mock */}
      {hasEvent && camera.status === 'active' && (
        <div 
          className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-300"
          style={{
            top: `${bbox.top}%`,
            left: `${bbox.left}%`,
            width: `${bbox.width}%`,
            height: `${bbox.height}%`
          }}
        >
          <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-t uppercase tracking-wider whitespace-nowrap shadow-lg">
            {bbox.label}: {bbox.conf}%
          </div>
        </div>
      )}

      {/* Overlay UI Header */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <span className="text-white font-medium text-sm flex items-center gap-2 drop-shadow-md">
            {camera.status === 'active' && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></span>
            )}
            {camera.name}
          </span>
          <span className="text-slate-300 text-xs drop-shadow-md">{camera.location}</span>
        </div>
        {hasEvent && (
          <span className="bg-red-500/20 text-red-400 border border-red-500/50 text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold animate-pulse backdrop-blur-sm shadow-lg">
            Alert
          </span>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
