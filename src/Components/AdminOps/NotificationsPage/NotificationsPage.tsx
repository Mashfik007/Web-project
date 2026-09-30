"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminPageShell from "@/Components/AdminCatalog/AdminPageShell/AdminPageShell";
import AdminCard from "@/Components/AdminOps/AdminCard/AdminCard";
import {
  FormField,
  ModalButton,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal";
import { sendNotification } from "@/Controller/admin.controller";
import type { AdminNotice } from "@/types/notice";

interface NotificationsPageProps {
  notices: AdminNotice[];
}

function formatWhen(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function NotificationsPage({ notices }: NotificationsPageProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const [sending, setSending] = useState(false);

  async function handleSubmit(form: HTMLFormElement) {
    if (sending) return;

    if (!formHasValues(form, ["title", "message"])) {
      feedback.failed("Message not sent", "Title and message are required.");
      return;
    }

    const data = new FormData(form);
    setSending(true);

    const result = await sendNotification({
      title: String(data.get("title") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    });

    setSending(false);

    if (!result.ok) {
      feedback.failed("Message not sent", result.message);
      return;
    }

    form.reset();
    router.refresh();
    feedback.success("Notification sent", result.message);
  }

  return (
    <AdminPageShell
      title="Notifications"
      subtitle="Send a message to every reader"
      framed={false}
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminCard>
          <form
            className="space-y-4 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit(event.currentTarget);
            }}
          >
            <h2 className="font-semibold text-slate-800">Compose Notification</h2>
            <p className="text-xs text-slate-400">
              This goes to all readers and shows up on their notifications page.
            </p>
            <FormField
              label="Title"
              name="title"
              placeholder="Notification title"
              required
            />
            <FormField
              label="Message"
              name="message"
              as="textarea"
              placeholder="Write your message here..."
              required
            />
            <div className="flex justify-end pt-2">
              <ModalButton type="submit">
                {sending ? "Sending..." : "Send to all users"}
              </ModalButton>
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <div className="p-5">
            <h2 className="font-semibold text-slate-800">Notification History</h2>
            {notices.length === 0 ? (
              <p className="mt-4 text-sm text-slate-400">
                No notifications sent yet.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {notices.map((notice) => (
                  <li key={notice.id} className="py-4">
                    <p className="font-semibold text-slate-800">{notice.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{notice.message}</p>
                    <p className="mt-2 text-xs text-slate-400">
                      {notice.recipients}{" "}
                      {notice.recipients === 1 ? "reader" : "readers"} ·{" "}
                      {formatWhen(notice.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </AdminCard>
      </div>

      <StatusModal
        id={feedback.id}
        variant={feedback.status.variant}
        title={feedback.status.title}
        message={feedback.status.message}
      />
    </AdminPageShell>
  );
}
