import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  IoSend, 
  IoFlash, 
  IoSettings, 
  IoCalendar, 
  IoTime, 
  IoRefresh, 
  IoRemove, 
  IoClose,
  IoChevronForward,
  IoSearch,
  IoBuild,
  IoAttach,
  IoImage,
  IoVideocam,
  IoCall,
  IoArrowBack
} from 'react-icons/io5';
import { FaRobot, FaUserAlt } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const SUGGESTED_QUESTIONS = [
  "How do I book a service?",
  "Why is my engine light on?",
  "Where is the nearest garage?",
  "How much does a full service cost?",
  "Common signs of brake failure?"
];

const AIChatAssistant = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      text: "Hello! 👋 I'm AutoMend AI. How can I help you today?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (text) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim()) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: messageToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setIsTyping(false);
      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        text: `I've received your query about "${messageToSend}". Our expert system is analyzing it. As a mock response, I recommend checking your owner's manual or booking a diagnostic session.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleReload = () => {
    setMessages([{ 
      id: 1, 
      type: 'ai', 
      text: "Chat reloaded! Everything cleared. How can I assist you?", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setInputValue('');
    setIsTyping(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'user',
        text: `Shared a file: ${file.name}`,
        file: file.name,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // Simulate AI response to file
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          text: `I've received your file: ${file.name}. I'm analyzing the image/video to help diagnose the issue. Please wait a moment...`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 1500);
    }
  };

  if (isClosed) {
    return (
      <div className="h-screen w-screen bg-deep-black flex items-center justify-center overscroll-none">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12 bg-card rounded-[3rem] border border-white/5 shadow-2xl max-w-md mx-auto">
          <div className="w-24 h-24 bg-warm-brown rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30 shadow-[0_0_50px_rgba(200,155,60,0.2)]">
            <IoClose className="text-5xl text-gold" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-white mb-4">Chat Session Ended</h2>
          <p className="text-text-muted mb-8">Thank you for consulting with AutoMend AI.</p>
          <div className="flex flex-col gap-3">
            <button onClick={() => setIsClosed(false)} className="w-full py-4 bg-gradient-to-r from-gold to-light-gold text-deep-black font-bold rounded-2xl hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all">Start New Chat</button>
            <button onClick={() => navigate('/')} className="w-full py-4 bg-soft-dark border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all">Go to Homepage</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-deep-black overflow-hidden overscroll-none flex flex-col pt-6">
      
      {/* TOP HEADER - BACK BUTTON */}
      <div className="px-8 md:px-12 py-4 flex items-center justify-between shrink-0">
        <motion.button 
          whileHover={{ x: -10 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-3 text-gold font-bold text-lg hover:text-light-gold transition-all group"
        >
          <div className="w-10 h-10 rounded-full border-2 border-gold/30 flex items-center justify-center group-hover:border-gold transition-colors">
            <IoArrowBack />
          </div>
          <span>Back to Home</span>
        </motion.button>
        
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-card/50 rounded-full border border-white/5 text-[10px] uppercase tracking-widest font-bold text-text-muted">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" />
          <span>Automotive AI Session Active</span>
        </div>
      </div>

      <div className="flex-1 px-4 md:px-8 lg:px-12 pb-8 pt-4 flex gap-8 overflow-hidden">
        
        {/* LEFT PANEL - RESPONSIVE WIDTH */}
        <motion.div 
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden lg:flex flex-col w-1/4 max-w-[350px] shrink-0 gap-6 h-full overflow-hidden"
        >
          <div className="bg-card/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] flex flex-col h-full overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
            
            <div className="flex items-center gap-4 mb-8 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-warm-brown flex items-center justify-center text-gold border border-gold/30 shadow-lg">
                <FaRobot className="text-2xl" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white">Assistant</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-8 pr-3">
              <div className="space-y-4">
                <h3 className="text-gold text-[11px] uppercase tracking-widest font-black flex items-center gap-2">
                  <IoSearch className="text-base" /> Quick Suggestions
                </h3>
                <div className="space-y-2.5">
                  {SUGGESTED_QUESTIONS.map((q, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleSendMessage(q)}
                      className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-text-gray hover:bg-gold/10 hover:border-gold/40 hover:translate-x-2 transition-all group flex items-center justify-between"
                    >
                      <span className="line-clamp-1">{q}</span>
                      <IoChevronForward className="text-gold opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-warm-brown/40 to-transparent border border-gold/20 rounded-[2rem] shadow-xl">
                <h4 className="text-white text-base font-bold mb-3 flex items-center gap-2"><IoCall className="text-gold" /> Helpline</h4>
                <p className="text-[11px] text-text-muted mb-6 leading-relaxed">Direct connection to our master mechanics.</p>
                <a href="tel:+919876543210" className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-deep-black text-xs font-black rounded-xl hover:shadow-[0_0_20px_rgba(200,155,60,0.4)] transition-all hover:-translate-y-1">
                  <IoCall /> +91 98765 43210
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* MAIN CHAT AREA - RESPONSIVE WIDTH */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex-1 flex flex-col bg-soft-dark/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] relative h-full"
        >
          {/* Header */}
          <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-warm-brown flex items-center justify-center text-gold shadow-inner border border-gold/20">
                  <FaRobot className="text-3xl" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-4 border-soft-dark shadow-lg animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-heading font-bold text-white">AutoMend AI</h2>
                  <span className="px-3 py-1 rounded-lg bg-gold/10 text-[10px] font-black text-gold border border-gold/20 uppercase tracking-[0.2em]">Live</span>
                </div>
                <p className="text-xs text-text-muted mt-1 font-medium tracking-wide">Intelligent Diagnostic Engine v2.5</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsClosed(true)}
                title="Close Chat"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-text-muted hover:bg-red-500/20 hover:text-red-500 hover:scale-110 transition-all border border-white/5"
              >
                <IoClose className="text-xl" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 md:px-12 py-10 space-y-8 custom-scrollbar scroll-smooth">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === 'ai' ? -40 : 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-5 max-w-[85%] lg:max-w-[70%] ${msg.type === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-1 shadow-2xl ${
                      msg.type === 'ai' ? 'bg-warm-brown text-gold border border-gold/30' : 'bg-gradient-to-br from-gold to-light-gold text-deep-black'
                    }`}>
                      {msg.type === 'ai' ? <FaRobot className="text-lg" /> : <FaUserAlt className="text-sm" />}
                    </div>
                    <div className="space-y-3">
                      <div className={`px-7 py-6 rounded-[2.5rem] text-sm md:text-base leading-relaxed shadow-2xl border ${
                        msg.type === 'ai' 
                          ? 'bg-card border-white/5 rounded-tl-none text-text-gray' 
                          : 'bg-gradient-to-r from-gold to-light-gold text-deep-black font-bold rounded-tr-none border-gold/30'
                      }`}>
                        {msg.text}
                        {msg.file && (
                          <div className="mt-4 p-4 bg-black/30 rounded-3xl flex items-center gap-4 border border-white/10">
                            <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                              <IoImage className="text-2xl" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-black text-white truncate uppercase tracking-widest">{msg.file}</p>
                              <p className="text-[10px] text-text-muted">Diagnostic asset shared</p>
                            </div>
                          </div>
                        )}
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-4 ${msg.type === 'ai' ? 'text-left' : 'text-right'}`}>{msg.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-5">
                  <div className="w-10 h-10 rounded-xl bg-warm-brown text-gold flex items-center justify-center border border-gold/30"><FaRobot className="text-lg" /></div>
                  <div className="px-10 py-6 bg-card rounded-[2rem] rounded-tl-none border border-white/5 flex gap-2 items-center shadow-xl">
                    {[0,1,2].map(i => (
                      <motion.div 
                        key={i} 
                        animate={{ y: [0, -8, 0], opacity: [0.3, 1, 0.3] }} 
                        transition={{ repeat: Infinity, duration: 0.8, delay: i*0.2 }} 
                        className="w-2.5 h-2.5 bg-gold rounded-full" 
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar (Thinner) */}
          <div className="p-4 md:p-6 border-t border-white/5 bg-white/[0.01] shrink-0">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center gap-4">
              <div className="flex-1 relative group">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask AutoMend AI..."
                  className="w-full bg-card border border-white/10 rounded-xl py-3 px-5 pr-14 focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 text-sm text-text-light placeholder:text-text-muted transition-all shadow-md"
                />
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-gold hover:bg-gold/10 transition-all group/btn"
                >
                  <IoAttach className="text-xl group-hover/btn:rotate-45 transition-transform" />
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,video/*" />
              </div>
              <button 
                type="submit" 
                disabled={!inputValue.trim() && !isTyping}
                className="w-10 h-10 bg-gradient-to-r from-gold to-light-gold text-deep-black rounded-lg flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all shrink-0 disabled:opacity-50"
              >
                <IoSend className="text-lg" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* Persistence / Minimize Bubble */}
      <AnimatePresence>
        {isMinimized && (
          <motion.div 
            initial={{ scale: 0, x: -100, y: 100 }} 
            animate={{ scale: 1, x: 0, y: 0 }} 
            className="fixed bottom-12 left-12 z-[300]"
          >
            <button 
              onClick={() => { setIsMinimized(false); navigate('/ai-assistant'); }} 
              className="w-24 h-24 rounded-full bg-gradient-to-r from-gold to-light-gold flex items-center justify-center shadow-[0_0_50px_rgba(200,155,60,0.6)] group hover:scale-110 transition-all border-4 border-deep-black animate-bounce-subtle"
            >
              <FaRobot className="text-4xl text-deep-black" />
              <div className="absolute left-full ml-4 bg-white text-deep-black px-5 py-2 rounded-2xl text-sm font-black whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Resume Session
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant;
