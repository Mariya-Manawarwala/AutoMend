import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  IoSend, IoArrowBack, IoClose, IoAttach, IoChevronBack
} from 'react-icons/io5';
import { useTheme } from '../context/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { sendChatMessage } from '../api/chat.api';

// Real robot profile picture — used in chat only
const MendyChatAvatar = ({ size = 32 }) => (
  <img
    src="/mendy-avatar.png"
    alt="Mendy AI"
    style={{
      width: size, height: size,
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid rgba(111,167,161,0.4)',
      flexShrink: 0,
      boxShadow: '0 2px 8px rgba(111,167,161,0.25)',
    }}
  />
);

// SVG Avatar kept only for the welcome/get-started card
const MendyAvatar = ({ size = "w-24 h-24" }) => (
  <div className={`${size} relative group`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-gold via-light-gold to-white rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
    <div className="relative w-full h-full bg-soft-dark rounded-full border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
      <div className="w-[85%] h-[85%] bg-deep-black rounded-full flex flex-col items-center justify-center gap-1">
        <div className="flex gap-4">
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
          <div className="w-4 h-4 rounded-full bg-white shadow-[0_0_10px_#FFF]" />
        </div>
        <div className="w-10 h-1 bg-white/20 rounded-full mt-2" />
      </div>
      <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-gold/40 to-transparent" />
    </div>
  </div>
);

const AIChatAssistant = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'ai', 
      text: `Hey there! I'm Mendy, your personal ${settings.garageName} assistant. What should I call you?`, 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!showWelcome) scrollToBottom();
  }, [messages, isTyping, showWelcome]);

  const handleSendMessage = async (text) => {
    const messageToSend = text || inputValue;
    if (!messageToSend.trim() || isTyping) return;

    const newUserMessage = {
      id: Date.now(),
      type: 'user',
      text: messageToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const data = await sendChatMessage(messageToSend);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: data.reply || data.message || "I'm here to help! Could you clarify that for me?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: "My sensors are experiencing a brief glitch. Let me try reconnecting!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-deep-black font-body text-white flex items-center justify-center p-4 md:p-8">
      {/* ── Background ── */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03]">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M-20,0 L120,50 L-20,100 L200,100 L200,0 Z" fill="white" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div 
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="relative z-10 w-full max-w-md bg-card/30 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-12 text-center shadow-2xl flex flex-col items-center"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
            
            {/* Back to home link on welcome card */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 flex items-center gap-1 text-text-muted hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              <IoChevronBack className="text-sm" /> Back
            </button>
            
            <MendyAvatar size="w-40 h-40" />
            
            <h1 className="text-4xl font-heading font-black italic mt-10 mb-4 tracking-tight">Meet <span className="text-gold">Mendy</span></h1>
            <p className="text-text-muted text-sm leading-relaxed mb-12 max-w-[280px] mx-auto">
              Your intelligent companion for all things automotive. Diagnostic, booking, and expert advice.
            </p>
            
            <button 
              onClick={() => setShowWelcome(false)}
              className="w-full py-5 bg-gold hover:bg-light-gold text-deep-black rounded-2xl font-black uppercase tracking-widest text-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started
            </button>
            
            <div className="mt-8 pt-8 border-t border-white/5 w-full flex justify-center gap-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Powered by AutoMend AI</span>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="chat"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-2xl h-[85vh] bg-card/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 md:px-8 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Back button — returns to previous page */}
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                >
                  <IoArrowBack className="text-sm" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                {/* Mendy robot image + info */}
                <div className="flex items-center gap-3 ml-1">
                  <div className="relative">
                    <MendyChatAvatar size={46} />
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-[#22252C]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-white italic uppercase tracking-tight leading-none">Mendy</h2>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-bold text-green-400 uppercase tracking-widest">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      AI Assistant · Active
                    </div>
                  </div>
                </div>
              </div>

              {/* Close — goes to home */}
              <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted hover:bg-red-500/10 hover:text-red-500 transition-all">
                <IoClose />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 space-y-6 custom-scrollbar">
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === 'ai' ? -20 : 20, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.type === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {/* Robot image next to each AI message */}
                    {msg.type === 'ai' && <MendyChatAvatar size={32} />}
                    <div className="space-y-1">
                      <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                        msg.type === 'ai' 
                          ? 'bg-soft-dark border border-white/5 rounded-tl-none text-white' 
                          : 'bg-gold text-dark-graphite font-bold rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[8px] font-black uppercase text-text-muted px-2 ${msg.type === 'ai' ? 'text-left' : 'text-right'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start gap-3">
                  <MendyChatAvatar size={32} />
                  <div className="bg-soft-dark px-4 py-3 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                    {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 md:p-8 bg-black/20 border-t border-white/5">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 border border-white/10 focus-within:border-gold/50 focus-within:bg-white/10 transition-all"
              >
                <button type="button" className="w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-gold transition-all">
                  <IoAttach className="text-xl" />
                </button>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask Mendy anything about your car..."
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-white/20"
                />
                <button 
                  disabled={!inputValue.trim() || isTyping}
                  className="w-10 h-10 bg-gold text-deep-black rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 transition-all"
                >
                  <IoSend />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatAssistant;
