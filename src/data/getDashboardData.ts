import type { DashboardData } from "@/types/dashboard";

export async function getDashboardData(userId: string): Promise<DashboardData> {
  return {
    userId,
    intro: {
      name: "Elara Ashford",
      dueBooks: 2,
      streak: 14,
      forYouHref: `/user/${userId}/foryou`,
      browseHref: `/user/${userId}/browsebook`,
    },
  };
}
