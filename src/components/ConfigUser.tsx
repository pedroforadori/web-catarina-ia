import React, { useRef, useState } from 'react';
import { Settings, Users, MessageSquare, AlertTriangle, TrendingUp, Save, Sparkles, Upload, PieChart, BarChart3, Activity, ArrowUpRight, ArrowDownRight, X, Search, Clock, Smartphone } from 'lucide-react';

// Types for Drill Down Data
interface ClientDetail {
  id: string;
  name: string;
  company: string;
  detail: string;
  time: string;
  status: 'success' | 'warning' | 'neutral';
}

interface DetailViewState {
  title: string;
  category: string; // To style badges etc
  data: ClientDetail[];
}

const ConfigUser: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [transferThreshold, setTransferThreshold] = useState(50);
  const [detailView, setDetailView] = useState<DetailViewState | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Arquivo selecionado para treinamento:", file.name);
      alert(`Arquivo "${file.name}" carregado para análise da IA.`);
    }
  };

  // --- MOCK DATA GENERATOR FOR DRILL DOWN ---
  const generateMockData = (category: string): ClientDetail[] => {
    const companies = ['TransLog Sul', 'Rodoviária Express', 'AgroTech Milho', 'Monitoramento 24h', 'Viação Estrela', 'Rapidão Entregas', 'Securitas Br', 'Fazenda Boa Vista'];
    const names = ['Carlos Silva', 'Ana Souza', 'Roberto Firmino', 'Juliana Paes', 'Marcos Castro', 'Fernanda Lima', 'Paulo Coelho', 'Mariana Ximenes'];
    
    return Array.from({ length: 8 }).map((_, i) => {
        let detail = '';
        let status: 'success' | 'warning' | 'neutral' = 'neutral';
        
        if (category === 'inbound-ai') {
            detail = 'Dúvida sobre cobertura M2M resolvida automaticamente.';
            status = 'success';
        } else if (category === 'inbound-human') {
            detail = 'Solicitou falar com atendente (Complexidade Alta).';
            status = 'warning';
        } else if (category.includes('active-sent')) {
            detail = 'Mensagem de abertura entregue.';
            status = 'neutral';
        } else if (category.includes('active-reply')) {
            detail = 'Respondeu interessado em chips multi-operadora.';
            status = 'success';
        } else if (category.includes('temp-hot')) {
            detail = 'Pronto para fechamento (> 100 linhas).';
            status = 'success';
        } else {
            detail = 'Aguardando interação.';
            status = 'neutral';
        }

        return {
            id: i.toString(),
            name: names[i],
            company: companies[i],
            detail,
            time: `${10 + i}:00`,
            status
        };
    });
  };

  const openDetail = (title: string, category: string) => {
    const data = generateMockData(category);
    setDetailView({ title, category, data });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-y-auto scrollbar-thin p-6 relative">
      
      {/* --- DRILL DOWN MODAL --- */}
      {detailView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
                    <div>
                        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                            {detailView.title}
                        </h3>
                        <p className="text-slate-400 text-xs mt-1">Detalhamento dos registros</p>
                    </div>
                    <button 
                        onClick={() => setDetailView(null)}
                        className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-4 border-b border-slate-800 bg-slate-900">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="Filtrar por nome ou empresa..." 
                            className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:border-indigo-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-y-auto p-2 scrollbar-thin flex-1">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-slate-900 z-10">
                            <tr className="text-xs text-slate-500 border-b border-slate-800">
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Cliente</th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider">Detalhe / Status</th>
                                <th className="px-4 py-3 font-semibold uppercase tracking-wider text-right">Horário</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {detailView.data.map((item) => (
                                <tr key={item.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors group">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors">{item.name}</div>
                                        <div className="text-xs text-slate-500 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> {item.company}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded border ${
                                            item.status === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                            item.status === 'warning' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                            'bg-slate-700/30 border-slate-600/30 text-slate-400'
                                        }`}>
                                            {item.detail}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-slate-500 font-mono">
                                        {item.time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-3 bg-slate-950/50 border-t border-slate-800 text-center text-xs text-slate-500">
                    Mostrando {detailView.data.length} registros recentes
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
            <h2 className="text-2xl font-bold text-white mb-2">Configurações Gerais</h2>
            <p className="text-slate-400 text-sm">Configuração do usuário e preferências.</p>
        </div>
        
        {/* Shiny AI Improvement Button */}
        <div>
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,.txt,.doc,.docx,.csv"
                onChange={handleFileChange}
            />
            <button 
                onClick={handleImportClick}
                className="relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200 animate-pulse"></div>
                <div className="relative flex items-center gap-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-lg transition-all font-semibold shadow-2xl active:scale-95">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Melhorar Inteligência IA
                    <Upload className="w-4 h-4 text-slate-400 ml-2" />
                </div>
            </button>
        </div>
      </div>

      {/* === DASHBOARD GRÁFICO === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* GRÁFICO 1: ATENDIMENTO SDR (INBOUND) - DONUT */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col relative overflow-hidden transition-all hover:border-slate-600">
            <div className="flex items-center justify-between mb-4 z-10">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Atendimento Inbound</h3>
                </div>
                <span className="text-xs text-slate-500">Hoje</span>
            </div>
            
            <div className="flex items-center gap-6 z-10">
                {/* CSS Donut Chart */}
                <div className="relative w-24 h-24 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform" onClick={() => openDetail('Total de Atendimentos', 'inbound-all')}>
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        {/* Background Circle */}
                        <path className="text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        {/* Data Circle (75%) */}
                        <path className="text-indigo-500 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]" strokeDasharray="75, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                        <span className="text-xl font-bold text-white">142</span>
                        <span className="text-[10px] text-slate-400 uppercase">Chats</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3 w-full">
                    <div 
                        onClick={() => openDetail('Atendimentos Retidos pela IA', 'inbound-ai')}
                        className="group cursor-pointer"
                    >
                        <div className="flex justify-between text-xs mb-1 group-hover:text-indigo-300 transition-colors">
                            <span className="text-slate-300">Retenção IA</span>
                            <span className="text-indigo-400 font-bold">75%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-indigo-500 h-full rounded-full group-hover:bg-indigo-400 transition-colors" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                    <div 
                        onClick={() => openDetail('Transbordo para Humano', 'inbound-human')}
                        className="group cursor-pointer"
                    >
                        <div className="flex justify-between text-xs mb-1 group-hover:text-slate-200 transition-colors">
                            <span className="text-slate-300">Transbordo Humano</span>
                            <span className="text-slate-500 font-bold">25%</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-slate-600 h-full rounded-full group-hover:bg-slate-500 transition-colors" style={{ width: '25%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>
        </div>

        {/* GRÁFICO 2: SDR ATIVO (FUNIL) - BAR CHART */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col relative transition-all hover:border-slate-600">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Funil SDR Ativo</h3>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                    <ArrowUpRight className="w-3 h-3" />
                    +12%
                </div>
            </div>

            <div className="flex items-end justify-between h-32 px-2 gap-2 mt-2">
                {/* Bar 1: Enviados */}
                <div 
                    onClick={() => openDetail('Leads: Mensagens Enviadas', 'active-sent')}
                    className="flex flex-col items-center gap-2 group w-full cursor-pointer"
                >
                    <div className="text-xs text-slate-400 font-mono group-hover:text-white transition-colors">850</div>
                    <div className="w-full bg-slate-800 rounded-t-lg relative h-24 overflow-hidden group-hover:bg-slate-700 transition-colors">
                        <div className="absolute bottom-0 w-full bg-indigo-900/40 h-full border-t border-indigo-500/30 group-hover:bg-indigo-900/60 transition-colors"></div>
                    </div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider group-hover:text-indigo-400">Envios</span>
                </div>

                {/* Bar 2: Respondidos */}
                <div 
                    onClick={() => openDetail('Leads: Responderam', 'active-reply')}
                    className="flex flex-col items-center gap-2 group w-full cursor-pointer"
                >
                    <div className="text-xs text-slate-400 font-mono group-hover:text-white transition-colors">320</div>
                    <div className="w-full bg-slate-800 rounded-t-lg relative h-12 overflow-hidden group-hover:bg-slate-700 transition-colors">
                        <div className="absolute bottom-0 w-full bg-indigo-600 h-full shadow-[0_0_10px_rgba(79,70,229,0.3)] group-hover:bg-indigo-500 transition-colors"></div>
                    </div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider group-hover:text-indigo-400">Resp.</span>
                </div>

                {/* Bar 3: Qualificados */}
                <div 
                    onClick={() => openDetail('Leads: Qualificados', 'active-qual')}
                    className="flex flex-col items-center gap-2 group w-full cursor-pointer"
                >
                    <div className="text-xs text-slate-400 font-mono group-hover:text-white transition-colors">45</div>
                    <div className="w-full bg-slate-800 rounded-t-lg relative h-6 overflow-hidden group-hover:bg-slate-700 transition-colors">
                         <div className="absolute bottom-0 w-full bg-emerald-500 h-full shadow-[0_0_10px_rgba(16,185,129,0.4)] group-hover:bg-emerald-400 transition-colors"></div>
                    </div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold tracking-wider group-hover:text-emerald-400">Qualif.</span>
                </div>
            </div>
        </div>

        {/* GRÁFICO 3: TEMPERATURA DA BASE - SEGMENTED BAR */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-slate-600">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-semibold text-slate-200">Temperatura da Base</h3>
                </div>
                <span className="text-xs text-slate-500">Total: 1.2k</span>
            </div>

            <div className="flex flex-col gap-5 justify-center h-full">
                {/* Cold */}
                <div 
                    onClick={() => openDetail('Leads Frios (Prospecção)', 'temp-cold')}
                    className="group cursor-pointer"
                >
                    <div className="flex justify-between text-xs mb-1.5 group-hover:text-blue-300 transition-colors">
                        <span className="text-blue-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-blue-500 group-hover:shadow-[0_0_8px_blue]"></span> Frios (Prospecção)
                        </span>
                        <span className="text-slate-300 font-mono">60%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-500/80 h-full rounded-full w-[60%] shadow-[0_0_8px_rgba(59,130,246,0.4)] group-hover:bg-blue-400 transition-colors"></div>
                    </div>
                </div>

                {/* Warm */}
                <div 
                    onClick={() => openDetail('Leads Mornos (Nutrição)', 'temp-warm')}
                    className="group cursor-pointer"
                >
                    <div className="flex justify-between text-xs mb-1.5 group-hover:text-amber-300 transition-colors">
                        <span className="text-amber-400 flex items-center gap-1.5">
                             <span className="w-2 h-2 rounded-full bg-amber-500 group-hover:shadow-[0_0_8px_orange]"></span> Mornos (Nutrição)
                        </span>
                        <span className="text-slate-300 font-mono">30%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500/80 h-full rounded-full w-[30%] shadow-[0_0_8px_rgba(245,158,11,0.4)] group-hover:bg-amber-400 transition-colors"></div>
                    </div>
                </div>

                {/* Hot */}
                <div 
                    onClick={() => openDetail('Leads Quentes (Fechamento)', 'temp-hot')}
                    className="group cursor-pointer"
                >
                    <div className="flex justify-between text-xs mb-1.5 group-hover:text-emerald-300 transition-colors">
                        <span className="text-emerald-400 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:shadow-[0_0_8px_emerald]"></span> Quentes (Fechamento)
                        </span>
                        <span className="text-slate-300 font-mono">10%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500/80 h-full rounded-full w-[10%] shadow-[0_0_8px_rgba(16,185,129,0.4)] group-hover:bg-emerald-400 transition-colors"></div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Configuração do Bot */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Settings className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-white font-semibold">Configuração da Catarina</h3>
          </div>
          
          <div className="space-y-4">
            <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Tom de Voz</label>
                <select className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 outline-none">
                    <option>Consultivo & Profissional (Padrão)</option>
                    <option>Direto & Objetivo</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Objetividade</label>
                    <input type="range" className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>Baixa</span>
                        <span>Alta</span>
                    </div>
                </div>
                <div>
                     <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Max. Mensagens</label>
                     <input type="number" value="2" readOnly className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-2 text-sm" />
                </div>
            </div>
          </div>
        </div>

        {/* Score Rules */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp className="w-24 h-24 text-emerald-500" />
           </div>
           <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold">Regras de Transferência</h3>
          </div>

          <div className="space-y-4 relative z-10">
             <div>
                <label className="block text-xs text-slate-400 uppercase font-bold tracking-wider mb-2">Gatilho (Qtd. Linhas/Veículos)</label>
                <input 
                    type="number" 
                    value={transferThreshold}
                    onChange={(e) => setTransferThreshold(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-lg p-3 text-sm focus:border-emerald-500 outline-none transition-colors"
                />
             </div>

             <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-lg">
                <span className="text-sm text-slate-300">Frota &lt; {transferThreshold} (Pequeno/Médio)</span>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-400/10 px-2 py-1 rounded">Ação: QUALIFICAR</span>
             </div>
             <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-emerald-500/30 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none"></div>
                <span className="text-sm text-white font-medium">Frota &ge; {transferThreshold} (Enterprise)</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-500/20">Ação: TRANSFERÊNCIA IMEDIATA</span>
             </div>
             <p className="text-[10px] text-slate-500 mt-2">
                * Clientes com mais de {transferThreshold} linhas são transferidos automaticamente sem validação de score adicional.
             </p>
          </div>
        </div>
      </div>

      {/* Objeções e Importação */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-white font-semibold">Base de Conhecimento & Objeções</h3>
            </div>
            <button 
                onClick={handleImportClick}
                className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
                <Upload size={14} /> Importar Conversas
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-800">
                        <th className="py-3 font-semibold uppercase tracking-wider">Categoria</th>
                        <th className="py-3 font-semibold uppercase tracking-wider">Gatilho</th>
                        <th className="py-3 font-semibold uppercase tracking-wider">Estratégia</th>
                        <th className="py-3 font-semibold uppercase tracking-wider">Ação</th>
                    </tr>
                </thead>
                <tbody className="text-sm text-slate-300">
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4"><span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">Preço</span></td>
                        <td className="py-4">"Achei caro", "Tenho proposta menor"</td>
                        <td className="py-4 text-indigo-300">Reforçar Estabilidade e SLA</td>
                        <td className="py-4 text-right"><Settings className="w-4 h-4 text-slate-500 cursor-pointer" /></td>
                    </tr>
                    <tr className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <td className="py-4"><span className="px-2 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">Fidelidade</span></td>
                        <td className="py-4">"Tem contrato?", "Multa rescisória"</td>
                        <td className="py-4 text-indigo-300">Segurança Jurídica & Parceria</td>
                        <td className="py-4 text-right"><Settings className="w-4 h-4 text-slate-500 cursor-pointer" /></td>
                    </tr>
                </tbody>
            </table>
          </div>
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-4 border-t border-slate-800">
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg shadow-emerald-900/20">
            <Save className="w-4 h-4" />
            Salvar Configurações
        </button>
      </div>

    </div>
  );
};

export default ConfigUser;