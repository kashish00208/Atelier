
import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({
  port: 8080
});

console.log("WebSocket server running on port 8080");

wss.on("connection", (ws, request) => {
  console.log("New client connected");

  ws.send(JSON.stringify({
    type: "WELCOME",
    message: "Connected to server!"
  }));
  ws.on("message", (data, isBinary) => {
    if (isBinary) {
      return;
    }

    const message = data.toString();

    console.log("Received:", message);

    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: "MESSAGE",
          message
        }));
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  // Handle errors
  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});
