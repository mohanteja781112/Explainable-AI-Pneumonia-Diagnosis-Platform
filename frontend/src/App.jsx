import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, CheckCircle, FileText, Send, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

const API_URL = "http://localhost:8000";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  
  // PDF Form State
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your AI Medical Assistant. I can help answer general questions about pneumonia and chest X-rays." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(URL.createObjectURL(file));
    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to connect to the AI Server.");
    } finally {
      setIsUploading(false);
    }
  };

  const generatePDF = async () => {
    if (!patientName || !patientId) {
      alert("Please enter Patient Name and ID first.");
      return;
    }
    
    setIsGeneratingPDF(true);
    try {
      const response = await fetch(`${API_URL}/generate-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName,
          patientId,
          diagnosis: result.diagnosis,
          confidence: result.confidence,
          originalImageBase64: result.original,
          heatmapImageBase64: result.heatmap
        })
      });
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Report_${patientName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    
    const newMsg = { role: 'user', text: chatInput };
    setMessages(prev => [...prev, newMsg]);
    setChatInput("");
    setIsChatting(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMsg.text })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I am offline right now." }]);
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#0f172a] text-slate-100 flex overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-blue-600/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 right-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0"></div>

      {/* Main Content Area (Left side) */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        
        {/* Fixed Header */}
        <header className="text-center pt-8 pb-4 shrink-0">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            Pediatric <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Pneumonia AI</span>
          </h1>
          <p className="text-slate-400 text-lg">Clinical Decision Support System</p>
        </header>

        {/* Scrollable Container for Upload / Results */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center custom-scrollbar">
          <div className="w-full max-w-4xl flex flex-col gap-6 pb-12">
            
            {/* Upload Section */}
            {!result && (
              <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-600/50 hover:border-blue-500/50 transition-colors mt-12">
                {isUploading ? (
                  <div className="flex flex-col items-center gap-4 text-blue-400">
                    <Loader2 className="w-12 h-12 animate-spin" />
                    <p className="text-lg font-medium animate-pulse">AI is analyzing the X-Ray...</p>
                  </div>
                ) : (
                  <>
                    <UploadCloud className="w-16 h-16 text-slate-400 mb-6" />
                    <h2 className="text-2xl font-bold mb-2">Upload Chest X-Ray</h2>
                    <p className="text-slate-400 mb-8">Drag & drop or click to browse</p>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full cursor-pointer font-medium transition-colors shadow-lg shadow-blue-500/20">
                      Select Image
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </>
                )}
              </div>
            )}

            {/* Results Section */}
            {result && (
              <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Diagnosis Banner */}
                <div className="glass-card p-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">AI Diagnosis</p>
                    <h2 className={`text-4xl font-black ${result.diagnosis === 'Normal' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {result.diagnosis}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider mb-1">Confidence Score</p>
                    <h2 className="text-4xl font-bold">{result.confidence}</h2>
                  </div>
                </div>

                {/* Images Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="glass-card p-4 flex flex-col">
                    <p className="text-sm font-semibold text-slate-300 mb-3 text-center">Original X-Ray</p>
                    <img src={result.original} alt="Original X-Ray" className="rounded-lg w-full object-contain bg-black/50" />
                  </div>
                  <div className="glass-card p-4 flex flex-col relative overflow-hidden group">
                    <p className="text-sm font-semibold text-slate-300 mb-3 text-center">Explainable AI (Grad-CAM)</p>
                    <img src={result.heatmap} alt="Grad-CAM Heatmap" className="rounded-lg w-full object-contain bg-black/50" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-xs text-slate-300">Red areas indicate regions the AI focused on to make its diagnosis.</p>
                    </div>
                  </div>
                </div>

                {/* Patient Form & PDF Download */}
                <div className="glass-card p-6 border-l-4 border-indigo-500">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    Generate Medical Report
                  </h3>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Patient Name</label>
                      <input type="text" value={patientName} onChange={(e)=>setPatientName(e.target.value)} placeholder="e.g. John Doe" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-semibold text-slate-400 mb-2">Patient ID</label>
                      <input type="text" value={patientId} onChange={(e)=>setPatientId(e.target.value)} placeholder="e.g. PT-12345" className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500" />
                    </div>
                    <button onClick={generatePDF} disabled={isGeneratingPDF} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/50 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 h-[42px]">
                      {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      Download PDF
                    </button>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <button onClick={() => setResult(null)} className="text-slate-400 hover:text-white font-medium flex items-center justify-center gap-2 w-full">
                    <RefreshCw className="w-4 h-4" /> Analyze Another Image
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot Sidebar (Right side, fixed height) */}
      <div className="w-96 bg-[rgba(30,41,59,0.7)] backdrop-blur-xl flex flex-col z-20 border-l border-slate-700/50 h-full shrink-0 shadow-2xl">
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/40 flex items-center gap-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <h3 className="font-bold text-slate-100">Medical AI Assistant</h3>
            <p className="text-xs text-slate-400">Powered by LLM</p>
          </div>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-sm' 
                  : 'bg-slate-700/50 text-slate-200 rounded-tl-sm border border-slate-600/50'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isChatting && (
            <div className="flex justify-start">
              <div className="bg-slate-700/50 rounded-2xl rounded-tl-sm px-4 py-3 text-sm border border-slate-600/50 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-800/60 border-t border-slate-700/50 shrink-0">
          <div className="relative flex items-center">
            <input 
              type="text" 
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder="Ask about symptoms, treatments..." 
              className="w-full bg-slate-900/50 border border-slate-600 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button 
              onClick={sendChatMessage}
              disabled={isChatting || !chatInput.trim()}
              className="absolute right-2 p-2 bg-blue-600 rounded-full text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;
