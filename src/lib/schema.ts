export interface ChatMessage {
  count: number;
  text: string;
  user: string;
  done?: boolean;
  tokens?: number;
  duration_total?: number;
}
