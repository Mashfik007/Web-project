import CommunityShelfPage from "@/Components/CommunityShelf/CommunityShelfPage/CommunityShelfPage";
import { getCommunityShelf } from "@/data/getCommunityShelf";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const community = await getCommunityShelf(id);

  return <CommunityShelfPage community={community} />;
}
