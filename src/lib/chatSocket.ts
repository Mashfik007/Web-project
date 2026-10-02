"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function socketUrl() {
  if (process.env.NEXT_PUBLIC_CHAT_SOCKET_URL) {
    return process.env.NEXT_PUBLIC_CHAT_SOCKET_URL;
  }
  // Local `next dev` runs Socket.IO on a separate port via instrumentation.
  if (process.env.NODE_ENV === "development") {
    return `${window.location.protocol}//${window.location.hostname}:3001`;
  }
  // Production (Railway): Socket.IO shares the Next.js HTTP server — same origin.
  return window.location.origin;
}

export function getChatSocket() {
  if (!socket) {
    socket = io(socketUrl(), {
      autoConnect: false,
      withCredentials: true,
      path: "/socket.io",
    });
    void openChatSocket(socket);
  }
  return socket;
}

async function openChatSocket(current: Socket) {
  try {
    const response = await fetch("/api/users/chat/token");
    if (!response.ok) return;
    const payload = (await response.json()) as { token?: string };
    if (!payload.token) return;
    current.auth = { token: payload.token };
    current.connect();
  } catch {
    current.connect();
  }
}
