let socket;
let reconnectAttempts = 0;

function connect() {
  socket = new WebSocket(
    "wss://example.com/ws"
  );

  socket.onopen = () => {
    console.log("Connected");
    reconnectAttempts = 0;
  };

  socket.onmessage = (event) => {
    console.log("Received:", event.data);
  };

  socket.onclose = () => {
    console.log("Disconnected");

    reconnect();
  };

  socket.onerror = (error) => {
    console.error(error);
  };
}

function reconnect() {
  const baseDelay = 1000;
  const maxDelay = 30000;

  const delay = Math.min(
    baseDelay * (2 ** reconnectAttempts),
    maxDelay
  );

  reconnectAttempts++;

  const jitter = Math.random() * 1000;

  setTimeout(connect, delay + jitter);
}

connect();