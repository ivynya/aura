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

export async function getModels() {
  const { api } = get(state);
  const models = await fetch(`${api}/api/tags`);
  const json = await models.json();
  return json;
}

async function readAllChunks(readableStream: ReadableStream|null) {
  if (!readableStream) return;
  const reader = readableStream.getReader();
  let done, value;
  while (!done) {
    ({ value, done } = await reader.read());
    if (done) break;
    const text = new TextDecoder("utf-8").decode(value);
    const json = JSON.parse(text);
    messages[messages.length - 1].text += json.response;
    if (json.done) {
      context = json.context;
      messages[messages.length - 2].done = true;
      messages[messages.length - 2].duration_total = json.prompt_eval_duration / 1000000;
      messages[messages.length - 2].tokens = json.prompt_eval_count;
      messages[messages.length - 1].done = true;
      messages[messages.length - 1].duration_total = json.eval_duration / 1000000;
      messages[messages.length - 1].tokens = json.eval_count;
      hljs.highlightAll();
    }
  }
}
