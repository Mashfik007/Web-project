import type { AdminDigitalResource, AdminNotice } from "@/types/adminOps";

export async function getAdminDigitalResources(
  _adminId: string,
): Promise<AdminDigitalResource[]> {
  return [
    {
      id: 1,
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      format: "PDF",
      category: "Technology",
      downloads: 312,
      size: "4.2 MB",
      coverClass: "bg-sky-100 text-sky-600",
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      format: "EPUB",
      category: "Non-Fiction",
      downloads: 198,
      size: "2.8 MB",
      coverClass: "bg-emerald-100 text-emerald-600",
    },
    {
      id: 3,
      title: "The Midnight Library",
      author: "Matt Haig",
      format: "EPUB",
      category: "Fiction",
      downloads: 254,
      size: "1.9 MB",
      coverClass: "bg-violet-100 text-violet-600",
    },
    {
      id: 4,
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      format: "PDF",
      category: "Science",
      downloads: 167,
      size: "6.1 MB",
      coverClass: "bg-amber-100 text-amber-600",
    },
    {
      id: 5,
      title: "Clean Code",
      author: "Robert C. Martin",
      format: "PDF",
      category: "Technology",
      downloads: 421,
      size: "5.4 MB",
      coverClass: "bg-rose-100 text-rose-600",
    },
    {
      id: 6,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      format: "EPUB",
      category: "Fiction",
      downloads: 88,
      size: "1.2 MB",
      coverClass: "bg-cyan-100 text-cyan-600",
    },
  ];
}

export async function getAdminNotices(
  _adminId: string,
): Promise<AdminNotice[]> {
  return [
    {
      id: 1,
      title: "Overdue Book Reminder",
      message: "Please return borrowed titles that are past due.",
      audience: "All Members",
      priority: "High",
      status: "Sent",
      recipients: 23,
      date: "2024-08-21",
    },
    {
      id: 2,
      title: "New Books Available",
      message: "This week's arrivals are now on the shelf.",
      audience: "All Members",
      priority: "Normal",
      status: "Scheduled",
      recipients: 120,
      date: "2024-08-24",
    },
    {
      id: 3,
      title: "Holiday Hours",
      message: "The library will close early on Friday.",
      audience: "Staff",
      priority: "Normal",
      status: "Draft",
      recipients: 8,
      date: "2024-08-18",
    },
  ];
}
