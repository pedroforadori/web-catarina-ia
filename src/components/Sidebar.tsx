import React from 'react';
import { Radio, BarChart3, Globe2, Server, LayoutDashboard, Settings, History, PhoneOutgoing } from 'lucide-react';
import type { ViewMode } from '../types';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-full p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-lg shadow-lg shadow-indigo-900/20 bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white">
          <Globe2 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">META</h1>
          <span className="text-xs text-indigo-400 font-semibold tracking-widest uppercase">Telecom</span>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">Plataforma</div>


        <SidebarItem
          icon={<PhoneOutgoing size={18} />}
          label="SDR Ativo"
          active={currentView === 'active'}
          onClick={() => onNavigate('active')}
        />
        <SidebarItem
          icon={<BarChart3 size={18} />}
          label="Painel Administrativo"
          active={currentView === 'admin'}
          onClick={() => onNavigate('admin')}
        />
        {/* <SidebarItem
          icon={<LayoutDashboard size={18} />}
          label="Atendimento SDR"
          active={currentView === 'chat'}
          onClick={() => onNavigate('chat')}
        /> */}
        {/* <SidebarItem 
            icon={<Globe2 size={18} />} 
            label="Cobertura Global" 
            onClick={() => {}} // Placeholder
        />
        <SidebarItem 
            icon={<History size={18} />} 
            label="Histórico de Leads" 
            onClick={() => {}} // Placeholder
        /> */}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        {/* <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
                <Server className="w-4 h-4 text-indigo-400" />
                <span className="text-xs text-slate-300 font-medium">Status da Rede</span>
            </div>
            <div className="space-y-3">
                <StatusRow label="Core Network" status="online" />
                <StatusRow label="APN Privada" status="online" />
                <StatusRow label="Latência Média" value="24ms" />
            </div>
        </div> */}
        <div className="mt-4 flex items-center gap-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer px-2">
          <SidebarItem
            icon={<Settings size={18} />}
            label="Configurações Gerais"
            // active={currentView === 'config'}
            onClick={() => onNavigate('config')}
          />
        </div>
      </div>
    </aside>
  );
};

const SidebarItem: React.FC<{ icon?: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${active
      ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]'
      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
      }`}>
    {icon}
    <span>{label}</span>
  </button>
);

const StatusRow: React.FC<{ label: string; status?: 'online' | 'offline'; value?: string }> = ({ label, status, value }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="text-slate-500">{label}</span>
    {status ? (
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></span>
        <span className={status === 'online' ? 'text-emerald-500' : 'text-red-500'}>{status === 'online' ? 'Online' : 'Offline'}</span>
      </div>
    ) : (
      <span className="text-slate-300 font-mono">{value}</span>
    )}
  </div>
);

export default Sidebar;