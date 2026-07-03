import React from 'react';
import Layout from '../components/Layout';
import { Sliders, Bell, HardDrive, Shield } from 'lucide-react';

const Settings = () => {
  return (
    <Layout>
      <div className="flex-1 flex flex-col p-6 h-full overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-2xl font-display font-semibold text-white">System Settings</h2>
          <p className="text-slate-400 text-sm mt-1">Configure your platform preferences and integrations</p>
        </header>

        <div className="max-w-3xl space-y-6">
          {/* Section 1 */}
          <section className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Sliders className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Computer Vision Models</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
                <div>
                  <p className="text-slate-200 font-medium">YOLOv8 Object Detection</p>
                  <p className="text-sm text-slate-400">Primary model for detecting persons and vehicles.</p>
                </div>
                <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-slate-200 font-medium">ALPR Engine</p>
                  <p className="text-sm text-slate-400">Automatic License Plate Recognition.</p>
                </div>
                <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer">
                  <div className="absolute left-1 top-1 bg-slate-400 w-4 h-4 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-medium text-white">Alert Rules</h3>
            </div>
            <p className="text-slate-400 mb-4 text-sm">Configure threshold levels for generating system alerts.</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 block mb-2">Confidence Threshold ({'>'} 85%)</label>
                <input type="range" min="50" max="99" defaultValue="85" className="w-full accent-purple-500" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
