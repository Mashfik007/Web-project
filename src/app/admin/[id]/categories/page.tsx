import CategoriesPage from "@/Components/AdminCatalog/CategoriesPage/CategoriesPage";
import { getArchivedCategories } from "@/data/getArchivedCategories";
import { getCategoriesData } from "@/data/getCategoriesData";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const [categories, archivedCategories] = await Promise.all([
    getCategoriesData(id),
    getArchivedCategories(),
  ]);

  return (
    <CategoriesPage
      categories={categories}
      archivedCategories={archivedCategories}
    />
  );
}
