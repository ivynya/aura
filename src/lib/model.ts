import { get } from 'svelte/store';
import { cfg } from '$lib/state';

export async function getModels() {
	const { api } = get(cfg);
	const models = await fetch(`${api}/api/tags`);
	const json = await models.json();
	return json;
}
