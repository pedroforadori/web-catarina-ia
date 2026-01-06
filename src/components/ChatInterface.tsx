import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, ShieldCheck, Zap, Activity, MessageSquare, Globe2, Lock } from 'lucide-react';
import { Sender, type Message } from '../types';
import { geminiService } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';

const QUICK_ACTIONS = [
  "Soluções M2M",
  "Rastreamento Veicular",
  "Problemas de Cobertura",
  "Agendar Reunião",
  "QUERO COMPRAR JA"
];

const PREDEFINED_RESPONSES: Record<string, string> = {
  "Soluções M2M": "Oi! Aqui é a Catarina, da Meta Telecom. Pra eu te indicar a solução certa, você vai usar os chips em quais equipamentos e em média quantas linhas você precisa?",
  "Rastreamento Veicular": "Perfeito. Aqui é a Catarina, da Meta Telecom. Hoje você já tem rastreadores ativos ou está começando do zero? E mais ou menos quantos veículos são?",
  "Problemas de Cobertura": "Entendi. Aqui é a Catarina, da Meta Telecom. Em quais cidades ou rotas você está tendo falha de sinal e isso acontece com quantas linhas hoje?",
  "Agendar Reunião": "Claro. Aqui é a Catarina, da Meta Telecom. Qual o melhor dia e horário pra você, e qual é o tamanho da sua operação (quantas linhas ou veículos)?"
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isChatEnded, setIsChatEnded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat
  useEffect(() => {
    geminiService.startChat();
    // Add initial bot greeting
    const initialMsg: Message = {
      id: 'init-1',
      text: INITIAL_GREETING,
      sender: Sender.BOT,
      timestamp: new Date()
    };
    setMessages([initialMsg]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputText;
    
    if (!textToSend.trim() || isLoading || isChatEnded) return;

    if (!textOverride) {
        setInputText('');
    }
    
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: Sender.USER,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Intercept "QUERO COMPRAR JA" (High Intent Logic)
    if (textToSend === "QUERO COMPRAR JA") {
        setIsChatEnded(true); // Lock the interface immediately
        
        // Simulate a brief natural pause before the definitive response
        setTimeout(() => {
            const finalMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "Perfeito. Já estou direcionando agora mesmo.\nUm executivo da Meta Telecom entra em contato com você neste instante.",
                sender: Sender.BOT,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, finalMsg]);
            setIsLoading(false);
        }, 1500);
        return;
    }

    // 3. Intercept Predefined Responses (Shortcuts)
    if (PREDEFINED_RESPONSES[textToSend]) {
        setTimeout(() => {
            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: PREDEFINED_RESPONSES[textToSend],
                sender: Sender.BOT,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMsg]);
            setIsLoading(false);
        }, 1200); // Simulate typing delay for natural feel
        return;
    }

    // 4. Standard Gemini Flow
    try {
      const responseText = await geminiService.sendMessage(textToSend);
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.BOT,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Houve um erro de comunicação com o servidor. Por favor, tente novamente.",
        sender: Sender.BOT,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full bg-meta-panel rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative">
      {/* Background Decorative Elements */}
      {/* <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none z-0"></div> */}

      {/* Header inside Chat */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg border border-indigo-500/30">
               <Globe2 className="w-6 h-6 text-white" />
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-slate-900 rounded-full ${isChatEnded ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
          </div>
          <div>
            <h2 className="text-white font-semibold text-sm tracking-wide">Catarina</h2>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-meta-subtext">Meta Telecom</span>
              <span className="w-1 h-1 rounded-full bg-slate-600"></span>
              <span className={`text-xs font-medium ${isChatEnded ? 'text-amber-400' : 'text-emerald-400'}`}>
                {isChatEnded ? 'Atendimento Direcionado' : 'Online'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="hidden md:flex flex-col items-end">
                <span className="text-xs text-meta-subtext uppercase tracking-wider font-bold">Uptime SLA</span>
                <span className="text-xs text-white font-mono">99.98%</span>
            </div>
        </div>
      </div>

      {/* Messages Area - PATCHED WITH GLOBAL CSS CLASSES */}
      {/* 
         - overflow-y-auto: Allows scrolling
         - overflow-x-hidden: Prevents horizontal scroll
         - pt-10/md:pt-12: Prevents top clipping
      */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-10 md:p-6 md:pt-12 space-y-5 relative z-10 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-row flex w-full ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
          >
            {/* 
              Applied 'chat-bubble' class for CSS patch.
              Added 'chat-text' to the text span.
            */}
            <div
              className={`chat-bubble max-w-[90%] md:max-w-[80%] rounded-2xl shadow-md text-sm ${
                msg.sender === Sender.USER
                  ? 'bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-br-none'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              <span className="chat-text">{msg.text}</span>
              <div className={`text-[10px] mt-2 opacity-60 ${msg.sender === Sender.USER ? 'text-indigo-200 text-right' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-row flex justify-start">
            <div className="chat-bubble bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none flex items-center gap-3">
               <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
               <span className="text-xs text-slate-400">Digitando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area & Quick Actions */}
      <div className="bg-slate-900/80 backdrop-blur-md border-t border-slate-800 relative z-20">
        
        {/* Quick Actions Bar */}
        <div className="px-4 pt-3 pb-1 overflow-x-auto flex gap-2 no-scrollbar">
            {QUICK_ACTIONS.map((action) => {
                const isBuyAction = action === "QUERO COMPRAR JA";
                
                // If chat is ended, we only show the Buy button in its "Encaminhando" state (or disabled state)
                if (isChatEnded && !isBuyAction) return null;

                const label = (isBuyAction && isChatEnded) ? "Encaminhando atendimento..." : action;

                return (
                    <button
                        key={action}
                        onClick={() => handleSendMessage(action)}
                        disabled={isLoading || isChatEnded}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full border text-xs transition-all whitespace-nowrap active:scale-95 disabled:cursor-not-allowed
                        ${isBuyAction 
                            ? isChatEnded
                                ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300 font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)] opacity-90'
                                : 'bg-emerald-600/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white font-bold tracking-wide hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-indigo-500 hover:bg-slate-700 hover:text-white disabled:opacity-50'
                        }`}
                    >
                        {label}
                        {isBuyAction && isChatEnded && <Activity className="w-3 h-3 inline ml-2 animate-pulse" />}
                    </button>
                )
            })}
        </div>

        <div className="p-4">
            <form onSubmit={handleFormSubmit} className="relative flex gap-2">
            <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isChatEnded ? "Atendimento finalizado." : "Digite sua mensagem..."}
                disabled={isLoading || isChatEnded}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 disabled:opacity-50 disabled:bg-slate-900"
            />
            <button
                type="submit"
                disabled={!inputText.trim() || isLoading || isChatEnded}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-700"
            >
                {isChatEnded ? <Lock className="w-4 h-4" /> : <Send className="w-4 h-4" />}
            </button>
            </form>
            <div className="mt-2 text-center">
                <p className="text-[10px] text-slate-600">Ambiente seguro e monitorado. Meta Telecom © {new Date().getFullYear()}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;