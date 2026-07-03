import React from 'react';
import { ShieldCheck, BrainCircuit, Activity, FileText, Bot, UploadCloud, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = ({ onUploadClick }) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative">
      
      {/* Background glow effects specific to hero */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>

      {/* Left Content */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 flex flex-col gap-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 w-fit">
          <Activity className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide uppercase">AI-Powered • Clinical Grade • Explainable</span>
        </div>

        <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Advanced AI for <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">
            Pediatric Pneumonia
          </span><br />
          Detection
        </h1>

        <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
          Our deep learning model analyzes chest X-Rays to help healthcare professionals detect pneumonia in children with unprecedented accuracy, backed by transparent Explainable AI.
        </p>

        {/* Feature Checkmarks */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm font-medium text-slate-300 mt-2">
          <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 90.38% Validation Accuracy</div>
          <div className="flex items-center gap-2"><BrainCircuit className="w-4 h-4 text-purple-400" /> Explainable AI (Grad-CAM)</div>
          <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /> Transfer Learning (CNNs)</div>
          <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-amber-400" /> Clinical PDF Reports</div>
          <div className="flex items-center gap-2 col-span-2"><Bot className="w-4 h-4 text-indigo-400" /> Interactive Medical AI Assistant</div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mt-6">
          <button 
            onClick={onUploadClick}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-1"
          >
            <UploadCloud className="w-5 h-5" />
            Upload X-Ray
          </button>
          <button className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-600/50 text-white font-semibold transition-all">
            <Play className="w-5 h-5 text-indigo-400" />
            View Demo
          </button>
        </div>
      </motion.div>

      {/* Right Content - Abstract Medical Visualization */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 h-[500px] w-full flex items-center justify-center"
      >
        <div className="relative w-full h-full max-w-md mx-auto">
          {/* Outer glowing rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-blue-500/30 w-full h-full"
          ></motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-8 rounded-full border border-indigo-500/20 w-[calc(100%-4rem)] h-[calc(100%-4rem)]"
          ></motion.div>

          {/* Central Glassmorphic Hologram */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-80 rounded-2xl bg-slate-900/40 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(59,130,246,0.2)] flex items-center justify-center overflow-hidden relative group">
              
              {/* Scanning laser animation */}
              <motion.div 
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-0.5 bg-cyan-400 shadow-[0_0_15px_#22d3ee] z-20"
              ></motion.div>

              {/* Placeholder for Lungs Image - CSS stylized */}
              <div className="relative w-48 h-56 flex flex-col items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                {/* Simplified lung shape representation using basic HTML/CSS */}
                <div className="flex gap-2 w-full h-full">
                  <div className="flex-1 bg-gradient-to-b from-blue-500/20 to-indigo-600/40 rounded-full blur-[2px] border border-blue-400/30"></div>
                  <div className="flex-1 bg-gradient-to-b from-blue-500/20 to-indigo-600/40 rounded-full blur-[2px] border border-blue-400/30 relative">
                     {/* Pneumonia Heatmap spot */}
                     <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-8 right-4 w-12 h-12 bg-rose-500/60 rounded-full blur-md"
                     ></motion.div>
                  </div>
                </div>
                {/* Windpipe */}
                <div className="absolute top-0 w-4 h-12 bg-blue-400/20 border-x border-blue-400/40 -mt-8 rounded-t-sm"></div>
              </div>

              {/* Floating Data Nodes */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-[10px] text-cyan-300 px-2 py-1 rounded border border-cyan-500/30">
                P(Pneumonia) = 0.99
              </div>
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-[10px] text-rose-300 px-2 py-1 rounded border border-rose-500/30">
                Anomaly Detected
              </div>

            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default HeroSection;
