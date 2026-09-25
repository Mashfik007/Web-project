"use client";

import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function socketUrl() {
  const protocol = window.location.protocol;
  const host = window.location.hostname;
  return `${protocol}//${host}:3001`;
}

export function getChatSocket() {
  if (!socket) {
    socket = io(socketUrl(), {
      autoConnect: false,
      withCredentials: true,
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
