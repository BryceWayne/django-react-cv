import React from 'react';
import { AlertCircle, User, Car, Activity, ShieldAlert } from 'lucide-react';

const EventIcon = ({ type }) => {
  switch (type) {
    case 'person_detected': return <User className="w-5 h-5 text-blue-400" />;
    case 'vehicle': return <Car className="w-5 h-5 text-purple-400" />;
    case 'motion': return <Activity className="w-5 h-5 text-green-400" />;
    case 'alert': return <ShieldAlert className="w-5 h-5 text-red-400" />;
    default: return <AlertCircle className="w-5 h-5 text-slate-400" />;
  }
};

const EventLog = ({ events }) => {
  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden">
      <div className="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
        <h3 className="font-display font-semibold text-lg text-white">System Events</h3>
        <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">Live</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">No recent events.</div>
        ) : (
          events.map(event => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/50 hover:bg-slate-800/80 transition-colors border border-slate-700/30 hover:border-slate-600">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                <EventIcon type={event.event_type} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {event.event_type.replace('_', ' ').toUpperCase()}
                  </p>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mb-1">{event.camera_name}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 line-clamp-1">{event.details}</p>
                  {event.confidence && (
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {(event.confidence * 100).toFixed(0)}% conf
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventLog;
