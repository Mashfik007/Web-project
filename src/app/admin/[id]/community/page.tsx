import CommunityGroupsPage from "@/Components/AdminCatalog/CommunityGroupsPage/CommunityGroupsPage";
import { getCommunityGroups } from "@/data/getCommunityGroups";

export const dynamic = "force-dynamic";

export default async function Page() {
  const groups = await getCommunityGroups();
  return <CommunityGroupsPage groups={groups} />;
}
