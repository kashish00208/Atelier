"use client";

import { useEffect, useRef, useState } from "react";

export default function Home() {
  const socketRef = useRef<WebSocket | null>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");

    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to server");
      setConnected(true);
    };

    ws.onmessage = (event) => {
      setMessages((prev) => [...prev, `Server: ${event.data}`]);
    };

    ws.onclose = () => {
      console.log("Disconnected from server");
      setConnected(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);

      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black flex items-center justify-center p-6">
      <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-zinc-800 dark:text-white">
            WebSocket Chat
          </h1>

          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              connected
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {/* Messages */}
        <div className="h-100 overflow-y-auto border border-zinc-200 dark:border-zinc-700 rounded-xl p-4 bg-zinc-50 dark:bg-zinc-800 space-y-2 mb-4">
          {messages.length === 0 ? (
            <p className="text-zinc-500 text-sm">
              No messages yet...
            </p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="p-3 rounded-lg bg-white dark:bg-zinc-700 shadow-sm text-zinc-800 dark:text-white"
              >
                {msg}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-black dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={sendMessage}
            disabled={!connected}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium transition"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}