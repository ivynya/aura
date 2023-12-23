
export async function send(model: string, prompt: string, context?: any[]): Promise<ReadableStream> {
  const res = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    body: JSON.stringify({ model, prompt, context }),
  });

  if (!res.ok) throw new Error('Failed to fetch');
  if (!res.body) throw new Error('No body');
  return res.body;
}
