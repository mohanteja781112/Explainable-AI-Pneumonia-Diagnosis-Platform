import React from 'react';
import { motion } from 'framer-motion';

const ResearchHighlights = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 relative z-10 border-t border-white/5 mt-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-3xl p-8 md:p-12 border border-white/10">
        
        <div className="flex-1">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            Research Achievements
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Setting a New Standard in <br className="hidden md:block" /> Pediatric Diagnostics
          </h2>
          <p className="text-slate-400 max-w-xl">
            Our AI model has been rigorously validated on a dataset of 5,863 chest X-rays, achieving a fine-tuned validation accuracy of 90.38%. By combining Transfer Learning with Grad-CAM Explainable AI, we bridge the gap between artificial intelligence and clinical trust.
          </p>
        </div>

        <div className="flex-1 w-full grid grid-cols-2 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">90.38%</h3>
            <p className="text-sm text-slate-400 font-medium">Validation Accuracy</p>
          </div>
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 text-center">
            <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">5,863</h3>
            <p className="text-sm text-slate-400 font-medium">Radiographs Analyzed</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResearchHighlights;
