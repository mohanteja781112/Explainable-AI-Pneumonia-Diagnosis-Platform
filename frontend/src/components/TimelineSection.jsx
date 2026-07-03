import React from 'react';
import { motion } from 'framer-motion';
import { Image, Cpu, Activity, Stethoscope, FileText, Bot } from 'lucide-react';

const steps = [
  { icon: Image, title: "1. Input", desc: "Raw X-Ray Image" },
  { icon: Cpu, title: "2. Preprocess", desc: "Resize & Normalize" },
  { icon: Activity, title: "3. Inference", desc: "DenseNet CNN" },
  { icon: Stethoscope, title: "4. Diagnosis", desc: "Prediction & Confidence" },
  { icon: FileText, title: "5. Report", desc: "XAI & PDF Generation" },
  { icon: Bot, title: "6. Assistant", desc: "LLM Consultation" }
];

const TimelineSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-20 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">Transparent AI Pipeline</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">Our end-to-end clinical workflow ensures full transparency, traceability, and interpretability at every stage of the decision-making process.</p>
      </div>

      <div className="relative">
        {/* Connecting Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 hidden lg:block"></div>
        <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-transparent -translate-y-1/2 hidden lg:block opacity-50"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center relative z-10 group-hover:border-blue-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 mb-4">
                  <Icon className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>
                <h4 className="text-white font-bold mb-1">{step.title}</h4>
                <p className="text-xs text-slate-400">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TimelineSection;
