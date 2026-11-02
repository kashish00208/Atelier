import { WebSocketServer, WebSocket } from "ws";

const PORT = 8080;

// Backend WebSocket servers
const servers = [
  "ws://localhost:8081",
  "ws://localhost:8082",
  "ws://localhost:8083"
];

let currentServer = 0;

const wss = new WebSocketServer({
  port: PORT
});

console.log(`Load balancer running on ${PORT}`);

wss.on("connection", (client) => {

  // Round-robin selection
  const target = servers[currentServer];

  currentServer = (currentServer + 1) % servers.length;

  console.log("Forwarding client to:", target);

  const backend = new WebSocket(target);

  backend.on("open", () => {
    console.log("Backend connected");

    client.on("message", (data, isBinary) => {
      if (backend.readyState === WebSocket.OPEN) {
        backend.send(data, { binary: isBinary });
      }
    });

    backend.on("message", (data, isBinary) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });

  backend.on("close", () => {
    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });

  client.on("close", () => {
    backend.close();
  });

  client.on("error", () => {
    backend.close();
  });

  backend.on("error", (error) => {
    console.error("Backend error:", error.message);

    if (client.readyState === WebSocket.OPEN) {
      client.close();
    }
  });
});