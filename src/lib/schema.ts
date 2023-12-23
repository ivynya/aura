export interface ChatMessage {
  text: string;
  user: string;
  done?: boolean;
  tokens?: number;
  duration_total?: number;
}
