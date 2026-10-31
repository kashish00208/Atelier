import ws from "ws";

interface WSS {
  server: ws.WebSocketServer;
  client: Map<string, ws.WebSocket>;
}

const wss: WSS = {
  server: new ws.WebSocketServer({ noServer: true, clientTracking: false }),
  client: new Map(),
};
