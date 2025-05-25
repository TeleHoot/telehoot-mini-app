import { useEffect, useRef, useState } from "react";

const WebSocketUrl = import.meta.env.VITE_API;

type MessageType = "join" | "start" | "next" | "leave" | "finish" | "cancel" | "error"
const messageTypes: MessageType[] = ["join", "start", "next", "leave", "finish", "cancel", "error"];

type MessageHandlers = Record<MessageType, (data: object) => void>

export const useWebSocket = ( join_code?: string) => {
  const [data, setData] = useState();
  const socketRef = useRef<WebSocket | null>(null);
  const [messageHandlers, setMessageHandlers] = useState<MessageHandlers | null>(null);

  useEffect(() => {
    if (!WebSocketUrl || !join_code) return;

    socketRef.current = new WebSocket(WebSocketUrl + `/api/v1/sessions/handle/join-code/${join_code}`);
    const socket = socketRef.current;

    socket.onmessage = (event) => {
      if (!messageHandlers) return;
      try {
        const message = JSON.parse(event.data);
        if (typeof message.type !== "string" || !messageTypes.includes(message.type)) return;

        const handler = messageHandlers[message.type as MessageType];
        handler(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };
  }, [WebSocketUrl, join_code, messageHandlers]);

  return { data, setMessageHandlers, send: (data: string) => socketRef.current?.send(data) };
};
