export interface ChatMessage {
  count: number;
  text: string;
  user: string;
  done?: boolean;
  duration?: number;
  tokens?: number;
}
