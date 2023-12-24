import { get } from "svelte/store";
import { state } from "$lib/state";

export async function send(model: string, prompt: string, context?: any[]): Promise<ReadableStream> {
  const { api } = get(state);
  const res = await fetch(`${api}/api/generate`, {
    method: 'POST',
    body: JSON.stringify({ model, prompt, context }),
  });

  if (!res.ok) throw new Error('Failed to fetch');
  if (!res.body) throw new Error('No body');
  return res.body;
}
