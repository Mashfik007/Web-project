import CommunityShelfPage from "@/Components/CommunityShelf/CommunityShelfPage/CommunityShelfPage";
import { getCommunityShelfData } from "@/Components/CommunityShelf/data/fakeCommunityShelfData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const community = await getCommunityShelfData(id);

  return <CommunityShelfPage community={community} />;
}
