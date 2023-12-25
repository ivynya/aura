export async function send(socket: WebSocket, model: string, prompt: string, context?: any[]) {
  const req = {
    "action": "generate",
    "generate": { model, prompt, context },
  }
  socket.send(JSON.stringify(req));
  console.log('sent', JSON.stringify(req));
}

export function mapModelShort(model: string): string {
  switch (model) {
    case "mist":
      return "mistral:latest";
    case "mist:q2_k":
      return "mistral:7b-instruct-v0.2-q2_K";
    case "mist:q4_0":
      return "mistral:7b-instruct-v0.2-q4_0";
    case "code":
      return "codellama:instruct";
    default:
      return model;
  }
}
