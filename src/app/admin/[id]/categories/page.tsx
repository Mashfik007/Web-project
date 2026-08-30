import CategoriesPage from "@/Components/AdminCatalog/CategoriesPage/CategoriesPage";
import { getCategoriesData } from "@/data/getCategoriesData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const categories = await getCategoriesData(id);

  return <CategoriesPage categories={categories} />;
}
