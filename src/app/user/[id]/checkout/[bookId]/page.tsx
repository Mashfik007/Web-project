import CheckoutPage from "@/Components/Checkout/CheckoutPage/CheckoutPage";
import { getCheckoutData } from "@/data/getCheckoutData";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string; bookId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id, bookId } = await params;
  const checkout = await getCheckoutData(id, bookId);

  if (!checkout) {
    notFound();
  }

  return <CheckoutPage checkout={checkout} />;
}
