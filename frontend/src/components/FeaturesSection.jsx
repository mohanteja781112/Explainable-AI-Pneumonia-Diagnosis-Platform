import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Eye, FileText, Bot, Zap, Lock } from 'lucide-react';

const features = [
  { icon: ShieldCheck, title: "High Accuracy", desc: "Fine-tuned deep learning model with 90.38% validation accuracy for pediatric cases.", color: "text-emerald-400", border: "hover:border-emerald-500/50" },
  { icon: Eye, title: "Explainable AI", desc: "Grad-CAM heatmaps highlight exact lung regions that influence the neural network's predictions.", color: "text-blue-400", border: "hover:border-blue-500/50" },
  { icon: FileText, title: "Clinical Reports", desc: "Instantly generate detailed PDF reports summarizing findings, confidence scores, and visuals.", color: "text-indigo-400", border: "hover:border-indigo-500/50" },
  { icon: Bot, title: "Medical AI Assistant", desc: "Built-in LLM powered by Google Gemini to answer clinical questions in real-time.", color: "text-purple-400", border: "hover:border-purple-500/50" },
  { icon: Zap, title: "Real-Time Prediction", desc: "Highly optimized inference engine delivers diagnostic results in milliseconds.", color: "text-amber-400", border: "hover:border-amber-500/50" },
  { icon: Lock, title: "Secure Data", desc: "All radiographs are processed locally without permanent storage, ensuring patient privacy.", color: "text-cyan-400", border: "hover:border-cyan-500/50" }
];

const FeaturesSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 relative z-10">
      
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Why Choose Our AI System?</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${feat.border} group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-slate-800 group-hover:bg-slate-700 transition-colors ${feat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FeaturesSection;
