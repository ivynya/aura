import { writable } from 'svelte/store';

export interface Config {
	api: string;
	protocol?: string;
	endpoint?: string;
	username?: string;
	password?: string;
	models?: string[];
	model_temperature?: number;
	model_top_k?: number;
	model_top_p?: number;
}

export const cfg = writable<Config>({
	api: 'http://localhost:11434',
	protocol: 'wss',
	endpoint: '',
	username: '',
	password: '',
	models: [],
	model_temperature: 1.0,
	model_top_k: 40,
	model_top_p: 0.9
});
export const connected_clients = writable<string>('not connected');
export const connected_providers = writable<string>('not connected');
