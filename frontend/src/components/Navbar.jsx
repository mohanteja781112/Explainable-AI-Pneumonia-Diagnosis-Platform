import React from 'react';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-slate-900/50 border-b border-white/10 z-50 relative"
    >
      {/* Logo & Branding */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.5)]">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            Pediatric <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pneumonia AI</span>
          </h1>
          <p className="text-xs text-slate-400">Clinical Decision Support System</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        {[
          { name: 'Home', id: 'home' },
          { name: 'Analysis', id: 'upload-section' },
          { name: 'Pipeline', id: 'pipeline' },
          { name: 'Features', id: 'features' },
          { name: 'About', id: 'about' }
        ].map((item) => (
          <a 
            key={item.name} 
            href={`#${item.id}`} 
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group"
          >
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500 transition-all group-hover:w-full"></span>
          </a>
        ))}
      </div>

    </motion.nav>
  );
};

export default Navbar;
