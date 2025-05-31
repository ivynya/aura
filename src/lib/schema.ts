export interface ChatMessage {
	count: number;

	done?: boolean;
	duration?: number;
	duration_total?: number;
	tokens?: number;

	model: string;
	role: 'assistant' | 'user' | 'tool';
	content: string;
	images?: string[];
	thumbs?: string[];

	tools?: Tool[];
	tool_calls?: ToolCall[];
}

export interface Tool {
	type: 'function';
	function: {
		name: string;
		description: string;
		parameters: {
			type: 'object';
			properties: {
				[key: string]: {
					type: string;
					description: string;
					enum?: string[];
				};
			};
			required: string[];
		};
	};
}

export interface ToolCall {
	function: {
		name: string;
		arguments: { [key: string]: string };
	};
}
