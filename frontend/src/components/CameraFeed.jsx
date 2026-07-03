import React, { useEffect, useState, useRef } from 'react';
import { Camera, Activity } from 'lucide-react';
import { createEvent } from '../api';
import * as tf from '@tensorflow/tfjs';
import * as cocossd from '@tensorflow-models/coco-ssd';

const CameraFeed = ({ camera }) => {
  const [hasEvent, setHasEvent] = useState(false);
  const [bboxes, setBboxes] = useState([]);
  const [modelLoading, setModelLoading] = useState(true);
  const videoRef = useRef(null);
  const lastEventTime = useRef(0);

  useEffect(() => {
    if (camera.status !== 'active') return;

    let model = null;
    let animationFrameId;
    let isDetecting = false;

    const loadModelAndDetect = async () => {
      await tf.ready();
      model = await cocossd.load();
      setModelLoading(false);
      detectFrame();
    };

    const detectFrame = async () => {
      if (videoRef.current && model && videoRef.current.readyState === 4 && !isDetecting) {
        isDetecting = true;
        const video = videoRef.current;
        const predictions = await model.detect(video);
        
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        
        const newBboxes = predictions.map(pred => {
          const [x, y, width, height] = pred.bbox;
          return {
            left: (x / videoWidth) * 100,
            top: (y / videoHeight) * 100,
            width: (width / videoWidth) * 100,
            height: (height / videoHeight) * 100,
            label: pred.class,
            conf: Math.round(pred.score * 100)
          };
        });
        
        setBboxes(newBboxes);
        setHasEvent(newBboxes.length > 0);

        const now = Date.now();
        if (newBboxes.length > 0 && now - lastEventTime.current > 5000) {
          const highestConf = newBboxes.reduce((prev, current) => (prev.conf > current.conf) ? prev : current);
          if (highestConf.conf > 50) {
            lastEventTime.current = now;
            try {
              createEvent({
                camera: camera.id,
                event_type: highestConf.label === 'person' ? 'person_detected' : 'vehicle',
                confidence: highestConf.conf / 100,
                details: `Detected ${highestConf.label} with ${highestConf.conf}% confidence`
              });
            } catch (e) {
              console.error("Failed to post CV event", e);
            }
          }
        }
        isDetecting = false;
      }
      
      animationFrameId = requestAnimationFrame(detectFrame);
    };

    loadModelAndDetect();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
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

      {/* Loading overlay for ML model */}
      {camera.status === 'active' && modelLoading && (
        <div className="absolute top-0 right-0 p-2 text-xs text-blue-400 bg-black/50 rounded-bl backdrop-blur">
          Loading CV Model...
        </div>
      )}

      {/* CV Bounding Boxes */}
      {camera.status === 'active' && bboxes.map((b, i) => (
        <div 
          key={i}
          className="absolute border-2 border-red-500 bg-red-500/10 pointer-events-none shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-75"
          style={{
            top: `${b.top}%`,
            left: `${b.left}%`,
            width: `${b.width}%`,
            height: `${b.height}%`
          }}
        >
          <div className="absolute -top-6 left-[-2px] bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-t uppercase tracking-wider whitespace-nowrap shadow-lg">
            {b.label}: {b.conf}%
          </div>
        </div>
      ))}

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
