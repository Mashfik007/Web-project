import ForYouPage from "@/Components/ForYou/ForYouPage/ForYouPage";
import { getForYouData } from "@/data/fakeForYouData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const forYou = await getForYouData(id);

  return <ForYouPage forYou={forYou} />;
}
