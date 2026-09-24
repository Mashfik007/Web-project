import ReservationsPage from "@/Components/AdminOps/ReservationsPage/ReservationsPage";
import { getAdminReservations } from "@/data/getAdminReservations";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const reservations = await getAdminReservations(id);

  return <ReservationsPage reservations={reservations} />;
}
