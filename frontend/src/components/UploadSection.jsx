import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, Lock, FileImage, RefreshCw, Loader2, FileText } from 'lucide-react';

const UploadSection = ({ onUpload, isUploading, result, onReset, patientName, setPatientName, patientId, setPatientId, generatePDF, isGeneratingPDF }) => {
  
  if (result) {
    return (
      <div className="w-full max-w-5xl mx-auto px-8 py-8 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
            <div>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Diagnosis Result</p>
              <h2 className={`text-5xl font-black ${result.diagnosis === 'Normal' ? 'text-emerald-400' : 'text-rose-400'} drop-shadow-lg`}>
                {result.diagnosis}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Confidence</p>
              <h2 className="text-4xl font-bold text-white">{result.confidence}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Original Image */}
            <div className="flex flex-col gap-3 group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">Input X-Ray</p>
                <div className="px-2 py-1 rounded bg-slate-800 text-[10px] text-slate-400">Original</div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/50 aspect-square flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                <img src={result.original} alt="Original" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Grad-CAM Image */}
            <div className="flex flex-col gap-3 group">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">Explainable AI</p>
                <div className="px-2 py-1 rounded bg-indigo-500/20 text-[10px] text-indigo-300 border border-indigo-500/30">Grad-CAM Heatmap</div>
              </div>
              <div className="relative rounded-2xl overflow-hidden border border-indigo-500/30 bg-black/50 aspect-square flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] group-hover:border-indigo-400 transition-colors">
                <img src={result.heatmap} alt="Grad-CAM" className="w-full h-full object-contain" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs text-slate-200 leading-relaxed">
                    <span className="text-rose-400 font-bold">Red/Yellow regions</span> highlight the specific anomalous features the neural network used to determine the diagnosis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-slate-800/40 p-4 rounded-2xl border border-white/5">
            <div className="flex gap-4 items-center flex-1 w-full">
              <input 
                type="text" 
                placeholder="Patient Name" 
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
              />
              <input 
                type="text" 
                placeholder="Patient ID" 
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-indigo-500 text-white placeholder-slate-500 transition-colors"
              />
              <button 
                onClick={generatePDF}
                disabled={isGeneratingPDF || !patientName || !patientId}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap transition-colors"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                Export PDF
              </button>
            </div>
            <div className="w-px h-10 bg-white/10 hidden md:block"></div>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors whitespace-nowrap w-full md:w-auto justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              New Scan
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-8 py-16 relative z-10" id="upload-section">
      
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Initialize Analysis</h2>
        <p className="text-slate-400">Securely upload a DICOM, PNG, or JPEG chest radiograph for instant AI evaluation.</p>
      </div>

      <motion.div 
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative group cursor-pointer"
      >
        {/* Animated outer border glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
        
        <label className="relative flex flex-col items-center justify-center w-full h-80 bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-[2rem] overflow-hidden hover:border-blue-500/50 transition-colors cursor-pointer">
          
          <input type="file" className="hidden" accept="image/*" onChange={onUpload} disabled={isUploading} />
          
          {isUploading ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin w-16 h-16 blur-[2px]"></div>
                <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-1">
                  Processing Radiograph...
                </p>
                <p className="text-sm text-slate-400">Running inference via Transfer Learning CNN</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center z-10">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-blue-500/20">
                <UploadCloud className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Drag & Drop Image</h3>
              <p className="text-slate-400 mb-8">or click to browse local files</p>
              
              <div className="px-6 py-2.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 font-medium group-hover:bg-blue-600 group-hover:text-white transition-colors">
                Browse Files
              </div>
            </div>
          )}

          {/* Decorative background icons */}
          <FileImage className="absolute top-12 left-16 w-32 h-32 text-slate-800/50 -rotate-12 pointer-events-none" />
          <Lock className="absolute bottom-12 right-16 w-40 h-40 text-slate-800/50 rotate-12 pointer-events-none" />
          
        </label>
      </motion.div>

      <div className="flex items-center justify-center gap-6 mt-8 text-sm text-slate-500">
        <div className="flex items-center gap-2"><Lock className="w-4 h-4" /> HIPAA Compliant Local Processing</div>
        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
        <div>Supported: JPG, PNG, JPEG</div>
        <div className="w-1 h-1 bg-slate-700 rounded-full"></div>
        <div>Max Size: 25MB</div>
      </div>

    </div>
  );
};

export default UploadSection;
