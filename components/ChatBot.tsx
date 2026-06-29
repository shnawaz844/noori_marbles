
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Camera, Image as ImageIcon } from 'lucide-react';
import { getInteriorAdvice } from '../services/geminiService';
import RoomVisualizer from './RoomVisualizer';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);
  const [visualizerMode, setVisualizerMode] = useState<'camera' | 'gallery'>('camera');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am your AI Design Assistant from Noori Marbels. How can I help you beautify your space today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

    setIsTyping(true);
    const aiResponse = await getInteriorAdvice(userMsg);
    setIsTyping(false);

    setMessages(prev => [...prev, { role: 'ai', content: aiResponse || 'Failed to get advice.' }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slideUp border border-slate-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              <div>
                <h4 className="font-bold text-sm">Design Advisor</h4>
                <p className="text-[10px] text-slate-400">Powered by AI</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user'
                  ? 'bg-amber-500 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 shadow-sm rounded-tl-none'
                  }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-slate-100 flex gap-2 items-center">
            <button
              onClick={() => {
                setVisualizerMode('camera');
                setIsVisualizerOpen(true);
              }}
              className="bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-amber-100 hover:text-amber-600 transition-colors"
              title="Camera: Capture Room"
            >
              <Camera size={18} />
            </button>
            <button
              onClick={() => {
                setVisualizerMode('gallery');
                setIsVisualizerOpen(true);
              }}
              className="bg-slate-100 text-slate-500 p-2 rounded-full hover:bg-amber-100 hover:text-amber-600 transition-colors"
              title="Gallery: Upload Room"
            >
              <ImageIcon size={18} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about flooring, tiles..."
              className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>

          {isVisualizerOpen && (
            <RoomVisualizer
              initialMode={visualizerMode}
              onClose={() => setIsVisualizerOpen(false)}
            />
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-3"
        >
          <span className="font-semibold text-sm pl-2">Chat with Expert</span>
          <div className="bg-amber-500 p-1 rounded-full">
            <MessageSquare size={24} />
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
