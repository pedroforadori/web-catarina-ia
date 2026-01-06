import React, { useState } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';
import ActiveSDR from './components/ActiveSDR';
import { Wifi, Shield, Cpu, Globe2 } from 'lucide-react';
import type { ViewMode } from './types';
import ConfigUser from './components/ConfigUser';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('chat');

  return (
    <div className="flex h-screen w-full bg-meta-dark font-sans overflow-hidden selection:bg-indigo-500/30">

      <Sidebar currentView={currentView} onNavigate={setCurrentView} />

      <main className="flex-1 flex flex-col h-full relative">
        {/* Mobile Header */}
        <div className="lg:hidden h-16 bg-slate-950 border-b border-slate-800 flex items-center px-4 justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div className="font-bold text-white tracking-tight">META <span className="text-indigo-500">Telecom</span></div>
          </div>
          <div className="text-xs text-emerald-500 font-mono bg-emerald-500/10 px-2 py-1 rounded">SISTEMA ATIVO</div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'chat' && (
            <div className="h-full p-3 md:p-6 flex gap-6 w-full max-w-[98%] mx-auto">
              {/* Main Chat Section */}
              <div className="flex-1 flex flex-col min-w-0 h-full">
                <div className="mb-4 hidden md:block shrink-0">
                  <h2 className="text-2xl font-bold text-white mb-1">Central de Soluções</h2>
                  <p className="text-slate-400 text-sm">Converse com nossa inteligência especializada para dimensionar sua operação.</p>
                </div>
                <ChatInterface />
              </div>

              {/* Right Info Panel (Desktop Only) */}
              <div className="hidden xl:flex flex-col w-80 space-y-4 pt-14 shrink-0 overflow-y-auto">
                {/* <InfoCard
                  title="Conectividade M2M"
                  description="Simcards multi-operadora com gestão em tempo real."
                  icon={<Wifi className="w-5 h-5 text-indigo-400" />}
                />
                <InfoCard
                  title="Segurança Dedicada"
                  description="APN Privada e VPN para tráfego de dados sensíveis."
                  icon={<Shield className="w-5 h-5 text-indigo-400" />}
                />
                <InfoCard
                  title="Inteligência IoT"
                  description="Plataforma de gestão completa para sua frota de dispositivos."
                  icon={<Cpu className="w-5 h-5 text-indigo-400" />}
                /> */}
                <div className="mt-auto p-4 rounded-xl border border-indigo-500/20 bg-gradient-to-br from-indigo-900/20 to-slate-900/50">
                  <h4 className="text-indigo-300 text-sm font-semibold mb-2">Suporte Enterprise</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Nossos especialistas humanos estão disponíveis para escalonar casos complexos identificados pelo assistente.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentView === 'active' && (
            <ActiveSDR />
          )}

          {currentView === 'admin' && (
            <div className="h-full w-full">
              <AdminPanel />
            </div>
          )}

          {currentView === 'config' && (
            <div className="h-full w-full">
              <ConfigUser />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const InfoCard: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/30 transition-colors group cursor-default">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:bg-indigo-950/30 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="text-slate-200 text-sm font-medium mb-1">{title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed">{description}</p>
      </div>
    </div>
  </div>
);

export default App;