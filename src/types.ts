export type Sender = 'user' | 'bot';

export const Sender = {
  USER: 'user' as const,
  BOT: 'bot' as const
};

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface Metric {
  label: string;
  value: string;
  trend: 'up' | 'stable' | 'down';
}

export type ViewMode = 'chat' | 'admin' | 'analytics' | 'active' | 'config';

export type LeadStatus = 'fria' | 'morna' | 'quente';

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone?: string;
  status: LeadStatus;
  lines: number;
}