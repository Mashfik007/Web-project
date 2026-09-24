import { getMyShelf } from "@/data/getMyShelf";
import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  const shelf = await getMyShelf(userId);
  const current = shelf.currentlyReading[0];
  const progress =
    current && current.pages > 0
      ? Math.min(100, Math.round((current.currentPage / current.pages) * 100))
      : 0;

  return {
    userId,
    intro: {
      name: shelf.user.name,
      dueBooks: shelf.currentlyReading.filter(
        (book) => book.daysLeft >= 0 && book.daysLeft <= 7,
      ).length,
      streak: shelf.user.streakDays,
      forYouHref: `/user/${userId}/foryou`,
      browseHref: `/user/${userId}/browsebook`,
    },
    reading: {
      counts: {
        reading: shelf.currentlyReading.length,
        completed: shelf.completed.length,
        want: shelf.wantToRead.length,
        history: shelf.borrowedHistory.length,
      },
      completed: shelf.completed.map((book) => ({
        title: book.title,
        author: book.author,
        coverImage: book.coverImage,
      })),
      current: current
        ? {
            title: current.title,
            author: current.author,
            coverImage: current.coverImage,
            progress,
            detail: `${Math.max(current.pages - current.currentPage, 0)}p left · due ${current.dueDate}`,
          }
        : null,
    },
  };
}
