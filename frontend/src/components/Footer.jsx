import React from 'react';
import { Code, Briefcase, Mail, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#070b14] border-t border-white/5 py-12 relative z-10 mt-auto">
      <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div>
          <h2 className="text-lg font-bold tracking-tight text-white mb-1">
            Pediatric <span className="text-blue-400">Pneumonia AI</span>
          </h2>
          <p className="text-sm text-slate-500">Research Project by Mohan Teja</p>
        </div>

        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <Code className="w-4 h-4" /> Source Code
          </a>
          <a href="#" className="text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-2 text-sm">
            <Briefcase className="w-4 h-4" /> Connect
          </a>
          <a href="#" className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" /> Contact
          </a>
        </div>

        <div className="text-xs text-slate-600 flex gap-4">
          <a href="#" className="hover:text-slate-400">Documentation</a>
          <a href="#" className="hover:text-slate-400">Privacy Policy</a>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
