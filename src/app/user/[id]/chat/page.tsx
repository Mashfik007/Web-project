import ChatPage from "@/Components/Chat/ChatPage/ChatPage";
import { getChatInbox } from "@/data/getChatInbox";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ with?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { with: peerId } = await searchParams;
  const inbox = await getChatInbox(id);

  return <ChatPage inbox={inbox} initialPeerId={peerId} />;
}
