export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const globalState = globalThis as typeof globalThis & {
    __chatSocketBooted?: boolean;
    __attachChatSocket?: (httpServer: unknown) => Promise<unknown>;
  };
  if (globalState.__chatSocketBooted) return;
  globalState.__chatSocketBooted = true;

  const { startChatSocket, attachChatSocket } = await import("./server/chatSocket");
  // Expose attach for the custom production server (server.js).
  globalState.__attachChatSocket = attachChatSocket as typeof globalState.__attachChatSocket;

  // Custom server attaches Socket.IO to the shared HTTP port (Railway).
  if (process.env.USE_CUSTOM_SERVER === "1") return;

  // `next dev` keeps a dedicated chat port.
  await startChatSocket();
}
