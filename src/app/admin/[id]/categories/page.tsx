import CategoriesPage from "@/Components/AdminCatalog/CategoriesPage";
import { getCategoriesData } from "@/Components/AdminCatalog/data/getCategoriesData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const categories = await getCategoriesData(id);

  return <CategoriesPage categories={categories} />;
}
