import MyShelfPage from "@/Components/MyShelf/MyShelfPage/MyShelfPage";
import { getMyShelf } from "@/data/getMyShelf";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const shelf = await getMyShelf(id);

  return <MyShelfPage shelf={shelf} />;
}
