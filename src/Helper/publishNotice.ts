import type { LibraryNotice } from "@/types/notice";

export const NOTICES_ROOM = "notices";

export async function publishNotice(notice: LibraryNotice) {
  const port = process.env.CHAT_SOCKET_PORT || "3001";
  const response = await fetch(`http://127.0.0.1:${port}/internal/notice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-notice-key": process.env.SECRET_ACCESS_TOKEN || "",
    },
    body: JSON.stringify(notice),
  });
  if (!response.ok) {
    throw new Error("Live notification could not be delivered");
  }
}
