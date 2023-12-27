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

export async function summarizeYoutube(socket: WebSocket, model: string, videoID: string) {
  const req = {
    "action": "summarize-youtube",
    "data": videoID,
    "generate": {
      model
    }
  }
  socket.send(JSON.stringify(req));
}

export function mapModelShort(model: string): string {
  switch (model) {
    case "mistral":
      return "mistral:latest";
    case "m:q2_k":
      return "mistral:7b-instruct-v0.2-q2_K";
    case "m:orca":
      return "mistral-openorca:latest";
    case "codellama":
      return "codellama:instruct";
    case "c:13b":
      return "codellama:13b-instruct";
    default:
      return model;
  }
}
