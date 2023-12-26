export async function send(socket: WebSocket, model: string, prompt: string, context?: any[]) {
  const req = {
    "action": "generate",
    "generate": {
      model,
      prompt,
      context
    },
  }
  socket.send(JSON.stringify(req));
}

export function mapModelShort(model: string): string {
  switch (model) {
    case "mistral":
      return "mistral:latest";
    case "mistral:q2_k":
      return "mistral:7b-instruct-v0.2-q2_K";
    case "codellama":
      return "codellama:instruct";
    case "codellama:13b":
      return "codellama:13b-instruct";
    default:
      return model;
  }
}
