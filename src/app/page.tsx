'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Briefcase, Layers, Sparkles, UserSearch, Send } from 'lucide-react';
import Chat from '../components/Chat';
import FluidBackground from '../components/FluidBackground';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

export default function Home() {
  const [view, setView] = useState<'hero' | 'chat'>('hero');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: input.trim(),
      };
      setMessages([userMessage]);
      setInput('');
      setView('chat');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleNavClick = (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
    };
    setMessages([userMessage]);
    setView('chat');
  };

  const handleSend = (msg: Message) => {
    setMessages(prev => [...prev, msg]);
  };

  if (view === 'chat') {
    return <Chat messages={messages} onSend={handleSend} onBack={() => setView('hero')} />;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <FluidBackground />
      {/* Header */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20">
        <motion.div
          className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L8 6L12 10L16 6L12 2Z" fill="white"/>
            <path d="M12 14L8 18L12 22L16 18L12 14Z" fill="white"/>
            <path d="M2 12L6 8L10 12L6 16L2 12Z" fill="white"/>
            <path d="M14 12L18 8L22 12L18 16L14 12Z" fill="white"/>
          </svg>
        </motion.div>
      </div>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 relative z-10">
        <motion.div
          className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center text-6xl mb-8"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          👤
        </motion.div>
        <motion.h1
          className="text-4xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Hey, I'm Itamar 👋
        </motion.h1>
        <motion.h2
          className="text-2xl text-gray-600 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          AI Portfolio
        </motion.h2>

        {/* Input Bar */}
        <motion.div
          className="relative max-w-md w-full mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="w-full py-4 px-6 pr-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
          />
          <button
            onClick={handleSubmit}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
          >
            <Send size={20} />
          </button>
        </motion.div>

        {/* Navigation */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <button
            onClick={() => handleNavClick("Tell me about yourself.")}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all shadow-lg group"
          >
            <User size={20} className="text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Me</span>
          </button>
          <button
            onClick={() => handleNavClick("Tell me about your best projects.")}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all shadow-lg group"
          >
            <Briefcase size={20} className="text-green-600 group-hover:text-green-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Projects</span>
          </button>
          <button
            onClick={() => handleNavClick("What is your tech stack?")}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all shadow-lg group"
          >
            <Layers size={20} className="text-purple-600 group-hover:text-purple-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Skills</span>
          </button>
          <button
            onClick={() => handleNavClick("Tell me something fun about you.")}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all shadow-lg group"
          >
            <Sparkles size={20} className="text-pink-600 group-hover:text-pink-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Fun</span>
          </button>
          <button
            onClick={() => handleNavClick("How can I contact you?")}
            className="flex flex-col items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl hover:bg-white/30 transition-all shadow-lg group"
          >
            <UserSearch size={20} className="text-orange-600 group-hover:text-orange-700 transition-colors" />
            <span className="text-sm font-medium text-gray-700">Contact</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
}
