
export interface Note {
  id: string;
  name: string;
  content: string;
  type: 'pdf' | 'text';
  timestamp: number;
  summary?: string;
  keyTakeaways?: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: { uri: string; title: string }[];
}

export interface SummaryResponse {
  summary: string;
  keyTakeaways: string[];
}
