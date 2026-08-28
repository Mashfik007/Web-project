import BrowsePage from "@/Components/Browse/BrowsePage/BrowsePage";
import { getBrowseBooksData } from "@/Components/Browse/data/fakeBrowseData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const browse = await getBrowseBooksData(id);

  return <BrowsePage browse={browse} />;
}
