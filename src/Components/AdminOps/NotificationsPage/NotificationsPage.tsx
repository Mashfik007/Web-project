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
import {
  draftNotification,
  sendNotification,
} from "@/Controller/admin.controller";
import type { AdminNotice, NotificationRecipient } from "@/types/notice";

interface NotificationsPageProps {
  notices: AdminNotice[];
  recipients: NotificationRecipient[];
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

export default function NotificationsPage({
  notices,
  recipients,
}: NotificationsPageProps) {
  const router = useRouter();
  const feedback = useFeedback();
  const [sending, setSending] = useState(false);
  const [drafting, setDrafting] = useState(false);
  const [audience, setAudience] = useState<"all" | "one">("all");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [draft, setDraft] = useState<{ title: string; message: string } | null>(
    null,
  );
  const [copied, setCopied] = useState<"title" | "message" | "all" | null>(null);

  async function handleSubmit(form: HTMLFormElement) {
    if (sending) return;

    if (!formHasValues(form, ["title", "message"])) {
      feedback.failed("Message not sent", "Title and message are required.");
      return;
    }

    if (audience === "one" && !selectedUserId) {
      feedback.failed("Message not sent", "Choose a reader to notify.");
      return;
    }

    const data = new FormData(form);
    setSending(true);

    const result = await sendNotification({
      title: String(data.get("title") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      ...(audience === "one" ? { userId: selectedUserId } : {}),
    });

    setSending(false);

    if (!result.ok) {
      feedback.failed("Message not sent", result.message);
      return;
    }

    form.reset();
    setSelectedUserId("");
    setAudience("all");
    router.refresh();
    feedback.success("Notification sent", result.message);
  }

  async function handleDraft() {
    if (drafting) return;

    const prompt = aiPrompt.trim();
    if (!prompt) {
      feedback.failed("Nothing to draft", "Describe what you want the AI to write.");
      return;
    }

    setDrafting(true);
    const result = await draftNotification(prompt);
    setDrafting(false);

    if (!result.ok || !result.draft) {
      feedback.failed("Draft failed", result.message);
      return;
    }

    setDraft(result.draft);
    setCopied(null);
  }

  async function copyText(
    which: "title" | "message" | "all",
    text: string,
  ) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      feedback.failed("Copy failed", "Could not copy to clipboard.");
    }
  }

  const sendLabel =
    audience === "one"
      ? sending
        ? "Sending..."
        : "Send to reader"
      : sending
        ? "Sending..."
        : "Send to all users";

  return (
    <AdminPageShell
      title="Notifications"
      subtitle="Send a message to every reader or one person"
      framed={false}
    >
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <div className="space-y-5">
          <AdminCard>
            <div className="space-y-4 p-5">
              <div>
                <h2 className="font-semibold text-slate-800">Ask AI to write</h2>
                <p className="text-xs text-slate-400">
                  Describe the email or notice you need. Review the draft, then
                  copy it into the form below.
                </p>
              </div>
              <fieldset className="fieldset p-0">
                <legend className="fieldset-legend">What should it say?</legend>
                <textarea
                  value={aiPrompt}
                  onChange={(event) => setAiPrompt(event.target.value)}
                  placeholder="e.g. Reminder that borrowed books are due this Friday, friendly tone"
                  rows={3}
                  className="textarea w-full"
                  maxLength={1000}
                />
              </fieldset>
              <div className="flex justify-end">
                <ModalButton type="button" onClick={() => void handleDraft()}>
                  {drafting ? "Writing..." : "Write with AI"}
                </ModalButton>
              </div>

              {draft ? (
                <div className="space-y-3 rounded-box border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Review draft
                    </h3>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() =>
                        void copyText(
                          "all",
                          `${draft.title}\n\n${draft.message}`,
                        )
                      }
                    >
                      {copied === "all" ? "Copied" : "Copy all"}
                    </button>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-500">Title</p>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => void copyText("title", draft.title)}
                      >
                        {copied === "title" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="rounded-box border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 select-all">
                      {draft.title}
                    </p>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="text-xs font-medium text-slate-500">
                        Message
                      </p>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => void copyText("message", draft.message)}
                      >
                        {copied === "message" ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <p className="whitespace-pre-wrap rounded-box border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 select-all">
                      {draft.message}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </AdminCard>

          <AdminCard>
            <form
              className="space-y-4 p-5"
              onSubmit={(event) => {
                event.preventDefault();
                void handleSubmit(event.currentTarget);
              }}
            >
              <h2 className="font-semibold text-slate-800">
                Compose Notification
              </h2>
              <p className="text-xs text-slate-400">
                Paste the AI draft here, or write your own. Choose all readers
                or one person — it shows on their notifications page.
              </p>

              <fieldset className="fieldset p-0">
                <legend className="fieldset-legend">Send to</legend>
                <div className="flex flex-wrap gap-4 pt-1">
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="audience"
                      className="radio radio-sm"
                      checked={audience === "all"}
                      onChange={() => setAudience("all")}
                    />
                    All readers
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="audience"
                      className="radio radio-sm"
                      checked={audience === "one"}
                      onChange={() => setAudience("one")}
                    />
                    Specific reader
                  </label>
                </div>
              </fieldset>

              {audience === "one" ? (
                <fieldset className="fieldset p-0">
                  <legend className="fieldset-legend">Reader</legend>
                  <select
                    className="select w-full"
                    value={selectedUserId}
                    onChange={(event) => setSelectedUserId(event.target.value)}
                    required
                  >
                    <option value="">Select a reader</option>
                    {recipients.map((reader) => (
                      <option key={reader.id} value={reader.id}>
                        {reader.name} ({reader.email})
                      </option>
                    ))}
                  </select>
                  {recipients.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-400">
                      No signed-up readers available yet.
                    </p>
                  ) : null}
                </fieldset>
              ) : null}

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
                <ModalButton type="submit">{sendLabel}</ModalButton>
              </div>
            </form>
          </AdminCard>
        </div>

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
                      {notice.recipientName
                        ? `To ${notice.recipientName}`
                        : `${notice.recipients} ${
                            notice.recipients === 1 ? "reader" : "readers"
                          }`}{" "}
                      · {formatWhen(notice.createdAt)}
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
