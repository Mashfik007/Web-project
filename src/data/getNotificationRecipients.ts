import connectDB from "@/dbConfig/dbConfig";
import { User } from "@/Model/Users";
import type { NotificationRecipient } from "@/types/notice";

export async function getNotificationRecipients(): Promise<
  NotificationRecipient[]
> {
  await connectDB();

  const users = await User.find({ isAdmin: { $ne: true } })
    .select("name email")
    .sort({ name: 1 })
    .lean<{ _id: { toString(): string }; name?: string; email?: string }[]>();

  return users
    .filter((user) => Boolean(user.email))
    .map((user) => ({
      id: user._id.toString(),
      name: user.name?.trim() || "Reader",
      email: user.email!.trim().toLowerCase(),
    }));
}
