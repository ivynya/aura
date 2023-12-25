export async function send(socket: WebSocket, model: string, prompt: string, context?: any[]) {
  const req = {
    "action": "generate",
    "generate": { model, prompt, context },
  }
  socket.send(JSON.stringify(req));
  console.log('sent', JSON.stringify(req));
}
