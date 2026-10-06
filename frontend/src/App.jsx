import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import StatsSection from './components/StatsSection';
import UploadSection from './components/UploadSection';
import TimelineSection from './components/TimelineSection';
import FeaturesSection from './components/FeaturesSection';
import AssistantSidebar from './components/AssistantSidebar';
import ResearchHighlights from './components/ResearchHighlights';
import Footer from './components/Footer';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);
  
  // PDF Form State
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I am your AI Medical Assistant. I can help answer general questions about pneumonia, chest X-rays, symptoms, treatments, and more.\n\nHow can I assist you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      // Auto scroll to results
      setTimeout(() => {
        document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (error) {
      console.error("Prediction error:", error);
      alert("Failed to connect to the AI Server.");
    } finally {
      setIsUploading(false);
    }
  };

  const generatePDF = async () => {
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
      a.download = `Clinical_Report_${patientName.replace(/\s+/g, '_')}.pdf`;
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

  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 bg-[#0B1121] text-slate-100 flex overflow-hidden font-sans selection:bg-indigo-500/30">
      
      {/* Global Background Glow */}
      <div className="absolute top-0 left-0 w-[50rem] h-[50rem] bg-indigo-600/10 rounded-full blur-[150px] -translate-x-1/4 -translate-y-1/4 pointer-events-none z-0"></div>
      
      {/* Main Left Content Area */}
      <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
        
        <Navbar />

        {/* Scrollable Dashboard Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          
          <HeroSection onUploadClick={scrollToUpload} />
          <StatsSection />
          
          <UploadSection 
            onUpload={handleImageUpload}
            isUploading={isUploading}
            result={result}
            onReset={() => setResult(null)}
            patientName={patientName}
            setPatientName={setPatientName}
            patientId={patientId}
            setPatientId={setPatientId}
            generatePDF={generatePDF}
            isGeneratingPDF={isGeneratingPDF}
          />

          <TimelineSection />
          <FeaturesSection />
          <ResearchHighlights />
          <Footer />

        </div>
      </div>

      {/* Persistent Chatbot Sidebar */}
      <AssistantSidebar 
        messages={messages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        sendChatMessage={sendChatMessage}
        isChatting={isChatting}
      />

    </div>
  );
}

export default App;
