import ScannerPage from "@/Components/Scanner/ScannerPage/ScannerPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <ScannerPage userId={id} />;
}
