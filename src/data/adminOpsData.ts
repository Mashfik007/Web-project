import type {
  AdminBorrowRequest,
  AdminDigitalResource,
  AdminFine,
  AdminFineSummary,
  AdminNotice,
  AdminReportPoint,
  AdminReservation,
  AdminReturnRecord,
  AdminScan,
  AdminTopBook,
} from "@/types/adminOps";

export async function getAdminBorrowRequests(
  _adminId: string,
): Promise<AdminBorrowRequest[]> {
  return [
    {
      id: 1,
      member: "Rafiqul Islam",
      initials: "RI",
      avatarClass: "bg-sky-100 text-sky-700",
      book: "The Great Gatsby",
      requested: "2024-08-21",
      expectedReturn: "2024-09-04",
      status: "Pending",
    },
    {
      id: 2,
      member: "Sarah Mitchell",
      initials: "SM",
      avatarClass: "bg-emerald-100 text-emerald-700",
      book: "Sapiens",
      requested: "2024-08-20",
      expectedReturn: "2024-09-03",
      status: "Approved",
    },
    {
      id: 3,
      member: "Tanvir Ahmed",
      initials: "TA",
      avatarClass: "bg-violet-100 text-violet-700",
      book: "Atomic Habits",
      requested: "2024-08-19",
      expectedReturn: "2024-09-02",
      status: "Pending",
    },
    {
      id: 4,
      member: "Priya Sharma",
      initials: "PS",
      avatarClass: "bg-amber-100 text-amber-700",
      book: "Dune",
      requested: "2024-08-18",
      expectedReturn: "2024-09-01",
      status: "Rejected",
    },
    {
      id: 5,
      member: "Nadia Rahman",
      initials: "NR",
      avatarClass: "bg-rose-100 text-rose-700",
      book: "1984",
      requested: "2024-08-17",
      expectedReturn: "2024-08-31",
      status: "Pending",
    },
    {
      id: 6,
      member: "Michael Chen",
      initials: "MC",
      avatarClass: "bg-cyan-100 text-cyan-700",
      book: "Clean Code",
      requested: "2024-08-16",
      expectedReturn: "2024-08-30",
      status: "Approved",
    },
  ];
}

export async function getAdminReturns(
  _adminId: string,
): Promise<AdminReturnRecord[]> {
  return [
    {
      id: 1,
      member: "Sarah Mitchell",
      initials: "SM",
      avatarClass: "bg-emerald-100 text-emerald-700",
      book: "Sapiens",
      issueDate: "2024-08-01",
      dueDate: "2024-08-15",
      returnDate: "2024-08-14",
      daysOverdue: 0,
      fine: 0,
      status: "Returned",
    },
    {
      id: 2,
      member: "Rafiqul Islam",
      initials: "RI",
      avatarClass: "bg-sky-100 text-sky-700",
      book: "1984",
      issueDate: "2024-08-02",
      dueDate: "2024-08-16",
      returnDate: null,
      daysOverdue: 8,
      fine: 80,
      status: "Overdue",
    },
    {
      id: 3,
      member: "Tanvir Ahmed",
      initials: "TA",
      avatarClass: "bg-violet-100 text-violet-700",
      book: "Dune",
      issueDate: "2024-08-16",
      dueDate: "2024-08-30",
      returnDate: null,
      daysOverdue: 0,
      fine: 0,
      status: "Due Today",
    },
    {
      id: 4,
      member: "Nadia Rahman",
      initials: "NR",
      avatarClass: "bg-rose-100 text-rose-700",
      book: "Atomic Habits",
      issueDate: "2024-08-18",
      dueDate: "2024-09-01",
      returnDate: null,
      daysOverdue: 0,
      fine: 0,
      status: "Active",
    },
    {
      id: 5,
      member: "Priya Sharma",
      initials: "PS",
      avatarClass: "bg-amber-100 text-amber-700",
      book: "The Midnight Library",
      issueDate: "2024-07-20",
      dueDate: "2024-08-03",
      returnDate: "2024-08-16",
      daysOverdue: 13,
      fine: 130,
      status: "Returned",
    },
  ];
}

export async function getAdminReservations(
  _adminId: string,
): Promise<AdminReservation[]> {
  return [
    {
      id: 1,
      member: "Tanvir Ahmed",
      initials: "TA",
      avatarClass: "bg-violet-100 text-violet-700",
      book: "Atomic Habits",
      reservedDate: "2024-08-21",
      queue: 1,
      estWait: "Ready now",
      status: "Ready",
    },
    {
      id: 2,
      member: "Sarah Mitchell",
      initials: "SM",
      avatarClass: "bg-emerald-100 text-emerald-700",
      book: "Project Hail Mary",
      reservedDate: "2024-08-20",
      queue: 2,
      estWait: "3 days",
      status: "Waiting",
    },
    {
      id: 3,
      member: "Rafiqul Islam",
      initials: "RI",
      avatarClass: "bg-sky-100 text-sky-700",
      book: "Dune",
      reservedDate: "2024-08-12",
      queue: 4,
      estWait: "Expired",
      status: "Expired",
    },
    {
      id: 4,
      member: "Nadia Rahman",
      initials: "NR",
      avatarClass: "bg-rose-100 text-rose-700",
      book: "Sapiens",
      reservedDate: "2024-08-22",
      queue: 1,
      estWait: "1 day",
      status: "Waiting",
    },
  ];
}

export async function getAdminFines(_adminId: string): Promise<{
  summary: AdminFineSummary;
  fines: AdminFine[];
}> {
  return {
    summary: {
      totalCollected: 12450,
      pendingAmount: 4820,
      waived: 1200,
      thisMonth: 2340,
    },
    fines: [
      {
        id: 1,
        member: "Fatema Begum",
        initials: "FB",
        avatarClass: "bg-sky-100 text-sky-700",
        book: "1984",
        type: "Overdue",
        amount: 80,
        date: "2024-08-21",
        status: "Pending",
      },
      {
        id: 2,
        member: "Rafiqul Islam",
        initials: "RI",
        avatarClass: "bg-violet-100 text-violet-700",
        book: "Dune",
        type: "Damage",
        amount: 250,
        date: "2024-08-18",
        status: "Pending",
      },
      {
        id: 3,
        member: "Sarah Mitchell",
        initials: "SM",
        avatarClass: "bg-emerald-100 text-emerald-700",
        book: "Sapiens",
        type: "Overdue",
        amount: 40,
        date: "2024-08-10",
        status: "Paid",
      },
      {
        id: 4,
        member: "Michael Chen",
        initials: "MC",
        avatarClass: "bg-cyan-100 text-cyan-700",
        book: "Clean Code",
        type: "Lost",
        amount: 800,
        date: "2024-08-05",
        status: "Waived",
      },
    ],
  };
}

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

export async function getAdminReports(_adminId: string): Promise<{
  trends: AdminReportPoint[];
  topBooks: AdminTopBook[];
}> {
  return {
    trends: [
      { month: "Mar", borrows: 210 },
      { month: "Apr", borrows: 280 },
      { month: "May", borrows: 340 },
      { month: "Jun", borrows: 410 },
      { month: "Jul", borrows: 360 },
      { month: "Aug", borrows: 490 },
    ],
    topBooks: [
      { title: "Sapiens", category: "Non-Fiction", borrows: 86, rating: 4.8 },
      {
        title: "Atomic Habits",
        category: "Non-Fiction",
        borrows: 74,
        rating: 4.7,
      },
      { title: "1984", category: "Fiction", borrows: 61, rating: 4.6 },
      { title: "Dune", category: "Science", borrows: 54, rating: 4.5 },
    ],
  };
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

export async function getAdminScans(_adminId: string): Promise<AdminScan[]> {
  return [
    {
      id: 1,
      title: "Clean Code",
      author: "Robert C. Martin",
      time: "09:42 AM",
      status: "Issued",
    },
    {
      id: 2,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      time: "09:28 AM",
      status: "Returned",
    },
    {
      id: 3,
      title: "1984",
      author: "George Orwell",
      time: "09:11 AM",
      status: "Issued",
    },
    {
      id: 4,
      title: "Dune",
      author: "Frank Herbert",
      time: "08:54 AM",
      status: "Returned",
    },
  ];
}
