import ForYouPage from "@/Components/ForYou/ForYouPage/ForYouPage";
import { getForYouData } from "@/data/getForYouData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const forYou = await getForYouData(id);

  return <ForYouPage forYou={forYou} userId={id} />;
}
