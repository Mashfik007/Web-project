export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const globalState = globalThis as typeof globalThis & { __chatSocketBooted?: boolean };
  if (globalState.__chatSocketBooted) return;
  globalState.__chatSocketBooted = true;

  const { startChatSocket } = await import("./server/chatSocket");
  await startChatSocket();
}
