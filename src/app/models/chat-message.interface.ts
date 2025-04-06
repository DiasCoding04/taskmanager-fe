export interface ChatMessage {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
} 