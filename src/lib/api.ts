import { get } from 'svelte/store';
import { cfg } from '$lib/state';
import type { ChatMessage, Tool } from './schema';

const example_tool: Tool = {
	type: 'function',
	function: {
		name: 'Get weather',
		description: 'Get the weather in a certain location',
		parameters: {
			type: 'object',
			properties: {
				location: {
					type: 'string',
					description: 'The location of the weather to get'
				},
				units: {
					type: 'string',
					description: 'Units to return in',
					enum: ['C', 'F', 'K']
				}
			},
			required: ['location']
		}
	}
};

export async function send(model: string, messages: ChatMessage[]): Promise<ReadableStream> {
	const { api } = get(cfg);
	const res = await fetch(`${api}/api/chat`, {
		method: 'POST',
		body: JSON.stringify({ model, messages, tools: [example_tool] })

		// body: JSON.stringify({ model, messages })
	});

	if (!res.ok) throw new Error('Failed to fetch');
	if (!res.body) throw new Error('No body');
	return res.body;
}

export async function getModels() {
	const { api } = get(cfg);
	const models = await fetch(`${api}/api/tags`);
	const json = await models.json();
	return json;
}
