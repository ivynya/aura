export interface ChatMessage {
	count: number;
	text: string;
	user: string;
	done?: boolean;
	duration?: number;
	duration_total?: number;
	tokens?: number;
}
