export const adminSections = [
  { slug: "books", label: "Books" },
  { slug: "categories", label: "Categories" },
  { slug: "authors", label: "Authors" },
  { slug: "publishers", label: "Publishers" },
  { slug: "users", label: "Users" },
  { slug: "community", label: "Community" },
  { slug: "borrow-requests", label: "Borrow Requests" },
  { slug: "returns", label: "Returns" },
  { slug: "reservations", label: "Reservations" },
  { slug: "fines", label: "Fines" },
  { slug: "orders", label: "Purchases" },
  { slug: "digital-library", label: "Digital Library" },
  { slug: "reports", label: "Reports" },
  { slug: "notifications", label: "Notifications" },
  { slug: "barcode", label: "Barcode / QR" },
  { slug: "thank-you", label: "Thank You" },
] as const;

export type AdminSectionSlug = (typeof adminSections)[number]["slug"];

export function isAdminSection(value: string): value is AdminSectionSlug {
  return adminSections.some((section) => section.slug === value);
}

export function adminHref(adminId: string, slug?: string) {
  return slug ? `/admin/${adminId}/${slug}` : `/admin/${adminId}`;
}
