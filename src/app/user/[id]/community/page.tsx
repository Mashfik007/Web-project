import CommunityShelfPage from "@/Components/CommunityShelf/CommunityShelfPage/CommunityShelfPage";
import { getCommunityGroupCards } from "@/data/getCommunityGroupCards";
import { getCommunityShelf } from "@/data/getCommunityShelf";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [community, groups] = await Promise.all([
    getCommunityShelf(id),
    getCommunityGroupCards(id),
  ]);

  return <CommunityShelfPage community={community} groups={groups} />;
}
