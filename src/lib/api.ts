import { get } from 'svelte/store';
import { cfg } from '$lib/state';
import type { ChatMessage, Model, Tool } from './schema';

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
		body: JSON.stringify({ model, messages, tools: [] })

		// body: JSON.stringify({ model, messages })
	});

	if (!res.ok) throw new Error('Failed to fetch');
	if (!res.body) throw new Error('No body');
	return res.body;
}

export async function getModels(): Promise<Model[]> {
	const { api } = get(cfg);
	const models = await fetch(`${api}/api/tags`);
	const json: Model[] = (await models.json()).models as unknown as Model[];
	if (!models.ok) throw new Error('Failed to fetch models');
	json.map(async (m) => {
		m.capabilities = (await getCapabilities(m.name)) || [];
		return m;
	});
	return json;
}

async function getCapabilities(model: string): Promise<string[]> {
	const { api } = get(cfg);
	const res = await fetch(`${api}/api/show`, {
		body: JSON.stringify({ model: model }),
		method: 'POST'
	});
	if (!res.ok) throw new Error('Failed to fetch capabilities');
	const json = (await res.json()).capabilities;
	return json as string[];
}
