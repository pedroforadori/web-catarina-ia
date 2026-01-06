import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Play, CheckCircle2, Building2, User, Phone, Thermometer, UserPlus, UploadCloud, X, Save, Smartphone, CheckSquare, Square, Rocket, MoreHorizontal } from 'lucide-react';
import { type Message, Sender, type Lead, type LeadStatus } from '../types';
import { geminiService } from '../services/geminiService';
import { ACTIVE_SDR_SYSTEM_INSTRUCTION } from '../constants';

// Initial Mock Data
const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Roberto Almeida', company: 'Logística Express', phone: '(11) 99999-1001', status: 'fria', lines: 0 },
  { id: '2', name: 'Juliana Torres', company: 'Tech Solutions', phone: '(21) 98888-2002', status: 'morna', lines: 0 },
  { id: '3', name: 'Carlos Mendes', company: 'Frota Segura', phone: '(31) 97777-3003', status: 'quente', lines: 0 },
];

const ActiveSDR: React.FC = () => {
  // Lead Management State
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  
  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // UI Actions State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [newLeadData, setNewLeadData] = useState({ name: '', company: '', phone: '', status: 'fria' as LeadStatus });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getOpeningMessage = (status: LeadStatus): string => {
    switch (status) {
      case 'fria':
        return "Oi, tudo bem? Aqui é a Catarina, da Meta Telecom. Estou falando com o responsável pela conectividade da empresa? Hoje vocês utilizam chip M2M ou algo similar?";
      case 'morna':
        return "Oi, tudo bem? Aqui é a Catarina, da Meta Telecom. Vi que vocês já avaliaram soluções de conectividade anteriormente. Posso entender como está esse cenário hoje?";
      case 'quente':
        return "Oi, tudo bem? Aqui é a Catarina, da Meta Telecom. Quero dar continuidade àquele contato sobre conectividade. Hoje vocês operam com quantas linhas ou veículos?";
      default:
        return "Oi, tudo bem? Aqui é a Catarina, da Meta Telecom.";
    }
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setMessages([]);
    setIsLoading(false);
    
    // Initialize Gemini with Active Persona
    geminiService.startChat(ACTIVE_SDR_SYSTEM_INSTRUCTION);
  };

  const startCampaign = () => {
    if (!selectedLead) return;

    const opener = getOpeningMessage(selectedLead.status);
    const initialMsg: Message = {
      id: Date.now().toString(),
      text: opener,
      sender: Sender.BOT,
      timestamp: new Date()
    };
    
    setMessages([initialMsg]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading || !selectedLead) return;

    const textToSend = inputText;
    setInputText('');
    
    // User Message (Simulating the Client)
    const userMsg: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: Sender.USER,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  // --- Lead Management Handlers ---

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulation of import processing
      const importedLeads: Lead[] = [
        { id: `imp-${Date.now()}-1`, name: 'Fernanda Costa', company: 'Agro Tech', phone: '(62) 99999-0000', status: 'fria', lines: 0 },
        { id: `imp-${Date.now()}-2`, name: 'Ricardo Silva', company: 'Varejo Bom', phone: '(11) 98888-0000', status: 'morna', lines: 0 },
        { id: `imp-${Date.now()}-3`, name: 'Grupo Monitora', company: 'Segurança 24h', phone: '(41) 97777-0000', status: 'quente', lines: 0 },
      ];
      setLeads(prev => [...importedLeads, ...prev]);
      alert(`${importedLeads.length} leads importados com sucesso!`);
    }
  };

  const handleSaveNewLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadData.name || !newLeadData.company) return;

    const newLead: Lead = {
      id: `man-${Date.now()}`,
      name: newLeadData.name,
      company: newLeadData.company,
      phone: newLeadData.phone,
      status: newLeadData.status,
      lines: 0
    };

    setLeads(prev => [newLead, ...prev]);
    setNewLeadData({ name: '', company: '', phone: '', status: 'fria' });
    setIsAddModalOpen(false);
  };

  // --- Bulk Selection Handlers ---

  const toggleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map(l => l.id));
    }
  };

  const toggleSelectLead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(prev => prev.filter(leadId => leadId !== id));
    } else {
      setSelectedLeadIds(prev => [...prev, id]);
    }
  };

  const handleBulkSend = () => {
    if (selectedLeadIds.length === 0) return;
    
    setIsBulkSending(true);
    
    // Simulate API delay
    setTimeout(() => {
        setIsBulkSending(false);
        setSelectedLeadIds([]);
        alert(`Campanha disparada com sucesso para ${selectedLeadIds.length} leads!`);
    }, 2000);
  };

  return (
    <div className="flex h-full gap-6 p-4 md:p-6 w-full max-w-[98%] mx-auto relative">
      
      {/* ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                Cadastrar Novo Lead
              </h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveNewLead} className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Nome do Contato</label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.name}
                  onChange={e => setNewLeadData({...newLeadData, name: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                  placeholder="Ex: Ana Souza"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Telefone / WhatsApp</label>
                <input 
                  type="tel" 
                  required
                  value={newLeadData.phone}
                  onChange={e => setNewLeadData({...newLeadData, phone: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                  placeholder="Ex: (11) 99999-9999"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Empresa</label>
                <input 
                  type="text" 
                  required
                  value={newLeadData.company}
                  onChange={e => setNewLeadData({...newLeadData, company: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                  placeholder="Ex: Transportadora Brasil"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Temperatura Inicial</label>
                <select 
                  value={newLeadData.status}
                  onChange={e => setNewLeadData({...newLeadData, status: e.target.value as LeadStatus})}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none"
                >
                  <option value="fria">Base Fria (Prospecção)</option>
                  <option value="morna">Base Morna (Reativação)</option>
                  <option value="quente">Base Quente (Fechamento)</option>
                </select>
              </div>
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Salvar Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Left Column: Lead List */}
      <div className="w-80 flex flex-col bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden shrink-0">
        
        {/* Lead List Header / Toolbar */}
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-2">
                 <button 
                    onClick={toggleSelectAll}
                    className="text-slate-400 hover:text-indigo-400 transition-colors"
                    title={selectedLeadIds.length === leads.length ? "Desmarcar todos" : "Selecionar todos"}
                 >
                     {leads.length > 0 && selectedLeadIds.length === leads.length ? (
                         <CheckSquare className="w-4 h-4 text-indigo-500" />
                     ) : (
                         <Square className="w-4 h-4" />
                     )}
                 </button>
                 <h3 className="text-white font-semibold flex items-center gap-2">
                    Leads ({leads.length})
                 </h3>
             </div>
             {selectedLeadIds.length > 0 && (
                 <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                     {selectedLeadIds.length} selecionados
                 </span>
             )}
          </div>
          
          {selectedLeadIds.length > 0 ? (
             // BULK ACTION TOOLBAR
             <button 
                onClick={handleBulkSend}
                disabled={isBulkSending}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 px-3 rounded-lg transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
             >
                {isBulkSending ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Disparando...
                    </>
                ) : (
                    <>
                        <Rocket className="w-4 h-4" />
                        Disparar para {selectedLeadIds.length} Leads
                    </>
                )}
             </button>
          ) : (
             // DEFAULT ACTIONS
             <div className="flex gap-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".csv,.xlsx" 
                    onChange={handleFileChange}
                />
                <button 
                    onClick={handleImportClick}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs py-2 px-3 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2"
                    title="Importar CSV"
                >
                    <UploadCloud className="w-3.5 h-3.5" />
                    Importar
                </button>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white text-xs py-2 px-3 rounded-lg border border-indigo-500/30 transition-colors flex items-center justify-center gap-2"
                    title="Novo Lead Manual"
                >
                    <UserPlus className="w-3.5 h-3.5" />
                    Cadastrar
                </button>
             </div>
          )}
        </div>

        {/* Lead List Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {leads.length === 0 ? (
             <div className="text-center p-6 text-slate-500 text-xs italic">
                Nenhum lead na fila.<br/>Importe ou cadastre para começar.
             </div>
          ) : (
             leads.map(lead => {
                const isSelected = selectedLeadIds.includes(lead.id);
                return (
                    <div 
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex gap-3 ${
                        selectedLead?.id === lead.id 
                        ? 'bg-indigo-600/10 border-indigo-500/50' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      {/* Checkbox Column */}
                      <div 
                        className="flex items-start pt-1" 
                        onClick={(e) => toggleSelectLead(e, lead.id)}
                      >
                         {isSelected ? (
                             <CheckSquare className="w-4 h-4 text-indigo-400 hover:text-indigo-300" />
                         ) : (
                             <Square className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                         )}
                      </div>

                      {/* Content Column */}
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              lead.status === 'quente' ? 'bg-emerald-500/20 text-emerald-400' :
                              lead.status === 'morna' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                              {lead.status}
                            </span>
                            {selectedLead?.id === lead.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                          </div>
                          <h4 className="text-sm font-medium text-slate-200 truncate">{lead.name}</h4>
                          <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
                            <Building2 className="w-3 h-3 flex-shrink-0" /> {lead.company}
                          </div>
                      </div>
                    </div>
                );
             })
          )}
        </div>
      </div>

      {/* Right Column: Active Simulation */}
      <div className="flex-1 flex flex-col bg-meta-panel rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative">
        {!selectedLead ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-60">
            <Phone className="w-12 h-12 mb-4" />
            <p>Selecione um lead para iniciar</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="w-5 h-5 text-slate-300" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">{selectedLead.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {selectedLead.company}
                    </div>
                    {selectedLead.phone && (
                        <div className="flex items-center gap-1 text-slate-500">
                            <Smartphone className="w-3 h-3" /> {selectedLead.phone}
                        </div>
                    )}
                    <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                    <div className="flex items-center gap-1">
                         <Thermometer className="w-3 h-3" /> Base {selectedLead.status}
                    </div>
                  </div>
                </div>
              </div>
              {messages.length === 0 && (
                <button 
                  onClick={startCampaign}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
                >
                  <Play className="w-3 h-3" /> INICIAR CONTATO
                </button>
              )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pt-10 md:p-6 space-y-5 relative z-10 scrollbar-thin bg-slate-950/30">
              {messages.length === 0 && (
                 <div className="flex items-center justify-center h-full text-xs text-slate-500 italic">
                    Aguardando início da campanha...
                 </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`chat-row flex w-full ${msg.sender === Sender.USER ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Note: In Simulation Mode, USER is the Client (Green/Blue), BOT is Catarina (Grey) */}
                  <div
                    className={`chat-bubble max-w-[90%] md:max-w-[80%] rounded-2xl shadow-md text-sm ${
                      msg.sender === Sender.USER
                        ? 'bg-slate-800 border border-slate-700 text-slate-300 rounded-br-none' // Client (simulated)
                        : 'bg-gradient-to-r from-indigo-700 to-indigo-600 text-white rounded-bl-none' // Catarina (Bot)
                    }`}
                  >
                    <span className="block text-[10px] mb-1 opacity-70 font-bold uppercase tracking-wider">
                        {msg.sender === Sender.BOT ? 'Catarina (Meta)' : 'Cliente'}
                    </span>
                    <span className="chat-text">{msg.text}</span>
                    <div className="text-[10px] mt-2 opacity-60 text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="chat-row flex justify-start">
                   <div className="chat-bubble bg-gradient-to-r from-indigo-700 to-indigo-600 rounded-2xl rounded-bl-none flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                      <span className="text-xs text-indigo-100">Catarina digitando...</span>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area (Simulating Client Response) */}
            <div className="p-4 bg-slate-900/80 border-t border-slate-800 z-20">
               <div className="relative flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={messages.length === 0 ? "Inicie a campanha primeiro..." : "Simular resposta do cliente..."}
                    disabled={isLoading || messages.length === 0}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600 disabled:opacity-50"
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading || messages.length === 0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md transition-colors disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
               </div>
               <div className="mt-2 text-center">
                  <p className="text-[10px] text-amber-500/80 flex items-center justify-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Modo Simulação: Você está respondendo como o <strong>Cliente</strong>
                  </p>
               </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActiveSDR;