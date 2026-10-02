import type { Server } from "socket.io";

type EmitBody = {
  event: string;
  rooms: string[];
  payload: unknown;
};

function localIo() {
  return (globalThis as typeof globalThis & { __chatIo?: Server }).__chatIo;
}

async function emitViaHttp({ event, rooms, payload }: EmitBody) {
  const port = Number(process.env.CHAT_SOCKET_PORT || 3001);
  const secret =
    process.env.INTERNAL_SOCKET_SECRET || process.env.SECRET_ACCESS_TOKEN || "";

  const response = await fetch(`http://127.0.0.1:${port}/internal/emit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-secret": secret,
    },
    body: JSON.stringify({ event, rooms, payload }),
  });

  if (!response.ok) {
    throw new Error(`Socket emit failed (${response.status})`);
  }
}

/** Emit to Socket.IO rooms from any Next.js route (local io or HTTP bridge). */
export async function emitRealtime(
  event: string,
  rooms: string[],
  payload: unknown,
) {
  const uniqueRooms = [...new Set(rooms.filter(Boolean))];
  if (uniqueRooms.length === 0) return;

  const io = localIo();
  if (io) {
    for (const room of uniqueRooms) {
      io.to(room).emit(event, payload);
    }
    return;
  }

  // `next dev` can evaluate route handlers without the instrumentation io handle.
  await emitViaHttp({ event, rooms: uniqueRooms, payload });
}
