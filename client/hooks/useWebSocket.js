// hooks/useWebSocket.js
import { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";

export default function useWebSocket(url) {
  const wsRef = useRef(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!url) return;
    const rws = new ReconnectingWebSocket(url);
    wsRef.current = rws;
    rws.addEventListener("message", (e) => {
      try {
        const d = JSON.parse(e.data);
        setMessages((s) => [d, ...s].slice(0, 200));
      } catch (err) {}
    });
    return () => rws.close();
  }, [url]);

  return { messages, send: (m) => wsRef.current?.send(JSON.stringify(m)) };
}
