'use client';

import React, { useState, useEffect, useRef } from 'react';
import { User, Briefcase, Layers, Sparkles, UserSearch, Settings, ArrowUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

interface ChatProps {
  messages: Message[];
  onSend: (msg: Message) => void;
  onBack: () => void;
}

const Chat: React.FC<ChatProps> = ({ messages: initialMessages, onSend, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: input.trim(),
      };
      setMessages(prev => [...prev, userMessage]);
      onSend(userMessage);
      setInput('');
      await getAIResponse([...messages, userMessage]);
    }
  };

  const getAIResponse = async (currentMessages: Message[]) => {
    setIsTyping(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: currentMessages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: data.content,
      };
      setMessages(prev => [...prev, aiMessage]);
      onSend(aiMessage);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
      onSend(errorMessage);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = async (prompt: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: prompt,
    };
    setMessages(prev => [...prev, userMessage]);
    onSend(userMessage);
    await getAIResponse([...messages, userMessage]);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Avatar and Messages */}
      <div className="flex-1 flex flex-col items-center px-4 pt-8 pb-4 overflow-y-auto">
        {/* Avatar */}
        <motion.div
          className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-5xl mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          👤
        </motion.div>

        {/* Messages */}
        <div className="w-full max-w-2xl space-y-4 mb-6">
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-center' : 'justify-start'}`}
            >
              {message.type === 'user' ? (
                <div className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md max-w-xs">
                  {message.content}
                </div>
              ) : (
                <div className="bg-gray-100 text-gray-800 px-6 py-3 rounded-2xl shadow-sm max-w-xl">
                  {message.content}
                </div>
              )}
            </motion.div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 px-6 py-3 rounded-2xl shadow-sm">
                <div className="flex space-x-1">
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-gray-400 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Questions Toggle */}
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setShowQuickQuestions(!showQuickQuestions)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${showQuickQuestions ? 'rotate-180' : ''}`}
          />
          {showQuickQuestions ? 'Hide' : 'Show'} quick questions
        </button>
      </div>

      {/* Quick Questions Navigation */}
      <AnimatePresence>
        {showQuickQuestions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-4 pb-4 overflow-hidden"
          >
            <div className="flex justify-center gap-2 flex-wrap max-w-3xl mx-auto">
              <button
                onClick={() => handleQuickQuestion("Tell me about yourself.")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <User size={18} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Me</span>
              </button>
              <button
                onClick={() => handleQuickQuestion("Tell me about your best projects.")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <Briefcase size={18} className="text-green-600" />
                <span className="text-sm font-medium text-gray-700">Projects</span>
              </button>
              <button
                onClick={() => handleQuickQuestion("What is your tech stack?")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <Layers size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Skills</span>
              </button>
              <button
                onClick={() => handleQuickQuestion("Tell me something fun about you.")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <Sparkles size={18} className="text-pink-600" />
                <span className="text-sm font-medium text-gray-700">Fun</span>
              </button>
              <button
                onClick={() => handleQuickQuestion("How can I contact you?")}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <UserSearch size={18} className="text-orange-600" />
                <span className="text-sm font-medium text-gray-700">Contact</span>
              </button>
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <Settings size={18} className="text-gray-600" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="px-4 pb-6">
        <div className="max-w-3xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything"
            className="w-full py-4 px-6 pr-16 rounded-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
