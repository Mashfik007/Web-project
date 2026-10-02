import { emitRealtime } from "@/Helper/emitRealtime";
import type { LiveChatMessage } from "@/types/chat";

export async function publishChatMessage(message: LiveChatMessage) {
  try {
    await emitRealtime("message:new", [message.conversationId], message);
  } catch (error) {
    console.error("[publishChatMessage] failed:", error);
  }
}
