import MyShelfPage from "@/Components/MyShelf/MyShelfPage/MyShelfPage";
import { getShelfData } from "@/data/fakeShelfData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const shelf = await getShelfData(id);

  return <MyShelfPage shelf={shelf} />;
}
