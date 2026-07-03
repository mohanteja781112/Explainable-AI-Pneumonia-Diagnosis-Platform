import React, { useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const suggestedPrompts = [
  "What are the symptoms of pediatric pneumonia?",
  "How does Grad-CAM explainability work?",
  "What is the difference between viral and bacterial pneumonia?",
];

const AssistantSidebar = ({ messages, chatInput, setChatInput, sendChatMessage, isChatting }) => {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatting]);

  return (
    <div className="w-96 bg-[#0B1121] border-l border-white/5 flex flex-col z-20 h-full shrink-0 shadow-2xl relative">
      
      {/* Sidebar Header */}
      <div className="p-5 border-b border-white/5 bg-slate-900/50 backdrop-blur-md flex items-center gap-4 shrink-0 relative z-10">
        <div className="relative">
          <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0B1121]"></div>
        </div>
        <div>
          <h3 className="font-bold text-slate-100 text-sm">AI Medical Assistant</h3>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-xs text-slate-400 font-medium">Online • Powered by Gemini</span>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-6 custom-scrollbar relative z-10">
        
        {messages.length === 1 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Suggested Prompts</p>
            <div className="flex flex-col gap-2">
              {suggestedPrompts.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => {
                    setChatInput(prompt);
                  }}
                  className="text-left p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 text-sm text-slate-300 hover:text-white transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-4">{prompt}</span>
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-end gap-2 max-w-[85%]">
                {msg.role === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mb-1">
                    <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                )}
                
                <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm' 
                    : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-8">
                {msg.role === 'user' ? 'You' : 'Medical AI'}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isChatting && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-end gap-2 max-w-[85%]"
          >
            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mb-1">
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl rounded-bl-sm px-4 py-4 flex items-center gap-1.5">
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
              <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full"></motion.div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-white/5 shrink-0 relative z-10">
        <div className="relative flex items-center group">
          <input 
            type="text" 
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            placeholder="Type your medical query..." 
            className="w-full bg-slate-800/80 border border-slate-700 rounded-full pl-5 pr-14 py-3.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-800 transition-all shadow-inner"
          />
          <button 
            onClick={sendChatMessage}
            disabled={isChatting || !chatInput.trim()}
            className="absolute right-1.5 p-2.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-500 disabled:opacity-40 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <p className="text-[9px] text-center text-slate-500 mt-3 px-4">
          Disclaimer: This AI is for educational and research purposes only. Not a substitute for professional medical advice.
        </p>
      </div>

    </div>
  );
};

export default AssistantSidebar;
