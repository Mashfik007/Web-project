import ReservationsPage from "@/Components/AdminOps/ReservationsPage";
import { getAdminReservations } from "@/Components/AdminOps/data/adminOpsData";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const reservations = await getAdminReservations(id);

  return <ReservationsPage reservations={reservations} />;
}
