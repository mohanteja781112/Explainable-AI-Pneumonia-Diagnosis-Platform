import React from 'react';
import { motion } from 'framer-motion';
import { Target, Layers, Database, Eye, MessageSquareText, FileText } from 'lucide-react';

const stats = [
  { icon: Target, title: "Validation Accuracy", value: "90.38%", desc: "After Fine-Tuning", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { icon: Layers, title: "Transfer Learning", value: "DenseNet", desc: "CNN Architecture", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Database, title: "Dataset", value: "5,863", desc: "Chest X-Rays", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: Eye, title: "Explainable AI", value: "Grad-CAM", desc: "Heatmap Visualization", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: MessageSquareText, title: "LLM Assistant", value: "Medical Q&A", desc: "Powered by Gemini", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: FileText, title: "Clinical Reports", value: "PDF Generator", desc: "Automated Findings", color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const StatsSection = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-8 py-12 relative z-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-5 flex flex-col items-start gap-3 hover:bg-slate-800/60 transition-colors group relative overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div className={`absolute top-0 right-0 w-20 h-20 ${stat.bg} blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{stat.title}</p>
                <h3 className="text-xl font-bold text-white mb-0.5">{stat.value}</h3>
                <p className="text-[10px] text-slate-500">{stat.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default StatsSection;
