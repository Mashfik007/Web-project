"use client";

import { AdminPageShell } from "@/Components/AdminCatalog/AdminCatalogUi";
import { AdminCard } from "@/Components/AdminOps/AdminOpsUi";
import {
  FormField,
  ModalButton,
  StatusModal,
  formHasValues,
  useFeedback,
} from "@/Components/Modal/AppModal";
import type { AdminNotice } from "@/types/adminOps";

interface NotificationsPageProps {
  notices: AdminNotice[];
}

export default function NotificationsPage({ notices }: NotificationsPageProps) {
  const feedback = useFeedback();

  return (
    <AdminPageShell
      title="Notifications"
      subtitle="Compose and manage library communications"
      framed={false}
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <AdminCard>
          <form
            className="space-y-4 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!formHasValues(event.currentTarget, ["title", "message"])) {
                feedback.failed(
                  "Message not sent",
                  "Title and message are required.",
                );
                return;
              }
              feedback.success(
                "Notification sent",
                "Members will see this message shortly.",
              );
            }}
          >
            <h2 className="font-semibold text-slate-800">Compose Notification</h2>
            <FormField
              label="Title"
              name="title"
              placeholder="Notification title"
            />
            <FormField
              label="Message"
              name="message"
              as="textarea"
              placeholder="Write your message here..."
            />
            <FormField
              label="Target Audience"
              name="audience"
              as="select"
              options={["All Members", "Staff", "Overdue borrowers"]}
            />
            <FormField
              label="Priority"
              name="priority"
              as="select"
              options={["Normal", "High"]}
            />
            <div className="flex items-center justify-between gap-3 pt-2">
              <ModalButton
                tone="secondary"
                onClick={() =>
                  feedback.success(
                    "Notification scheduled",
                    "The message was saved to send later.",
                  )
                }
              >
                Schedule
              </ModalButton>
              <ModalButton type="submit">Send Now</ModalButton>
            </div>
          </form>
        </AdminCard>

        <AdminCard>
          <div className="p-5">
            <h2 className="font-semibold text-slate-800">Notification History</h2>
            <ul className="mt-4 divide-y divide-slate-100">
              {notices.map((notice) => (
                <li key={notice.id} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {notice.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        {notice.message}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        notice.status === "Sent"
                          ? "bg-emerald-50 text-emerald-600"
                          : notice.status === "Scheduled"
                            ? "bg-sky-50 text-sky-600"
                            : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {notice.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      {notice.recipients} recipients ·{" "}
                      <span
                        className={
                          notice.priority === "High"
                            ? "text-rose-500"
                            : "text-sky-500"
                        }
                      >
                        {notice.priority}
                      </span>
                    </span>
                    <span>{notice.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </AdminCard>
      </div>

      <StatusModal
        open={feedback.status !== null}
        onClose={feedback.closeStatus}
        variant={feedback.status?.variant ?? "success"}
        title={feedback.status?.title ?? ""}
        message={feedback.status?.message ?? ""}
      />
    </AdminPageShell>
  );
}
