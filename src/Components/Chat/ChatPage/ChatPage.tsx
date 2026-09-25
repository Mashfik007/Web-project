"use client";

import { getChatSocket } from "@/lib/chatSocket";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChatInbox, ChatMessage, ChatPreview, LiveChatMessage } from "@/types/chat";

interface ChatPageProps {
  inbox: ChatInbox;
  initialPeerId?: string;
}

function formatStamp(iso: string | null) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function ChatPage({ inbox, initialPeerId }: ChatPageProps) {
  const starting =
    inbox.directs.find((item) => item.peerId === initialPeerId) ?? inbox.community;
  const [channel, setChannel] = useState<"group" | "direct">(
    starting.kind === "direct" ? "direct" : "group",
  );
  const [community, setCommunity] = useState(inbox.community);
  const [directs, setDirects] = useState(inbox.directs);
  const [selectedId, setSelectedId] = useState(starting.conversationId);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [live, setLive] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);
  const selectedIdRef = useRef(selectedId);
  selectedIdRef.current = selectedId;

  const conversations = useMemo(() => {
    const list = channel === "group" ? [community] : directs;
    const term = query.trim().toLowerCase();
    if (!term) return list;
    return list.filter((item) => item.title.toLowerCase().includes(term));
  }, [channel, community, directs, query]);

  const selected =
    selectedId === community.conversationId
      ? community
      : (directs.find((item) => item.conversationId === selectedId) ?? community);

  useEffect(() => {
    const socket = getChatSocket();
    let cancelled = false;

    function load() {
      socket.timeout(10000).emit("conversation:history", selectedId, (err: Error | null, ack: unknown) => {
        if (cancelled) return;
        const payload = ack as { ok?: boolean; message?: string; messages?: ChatMessage[] } | undefined;
        if (err || !payload?.ok) {
          setError(payload?.message || "Live chat could not load this conversation.");
          setLoading(false);
          return;
        }
        setMessages((current) => {
          const incoming = payload.messages ?? [];
          const ids = new Set(incoming.map((item) => item.id));
          return [...incoming, ...current.filter((item) => !ids.has(item.id))];
        });
        setError("");
        setLoading(false);
      });
    }

    setMessages([]);
    setLoading(true);
    socket.on("connect", load);
    if (socket.connected) load();

    return () => {
      cancelled = true;
      socket.off("connect", load);
    };
  }, [selectedId]);

  useEffect(() => {
    const socket = getChatSocket();

    function syncLive() {
      setLive(socket.connected);
    }

    function onMessage(message: LiveChatMessage) {
      const patch = (item: ChatPreview) =>
        item.conversationId === message.conversationId
          ? { ...item, lastBody: message.body, lastAt: message.createdAt }
          : item;
      setCommunity(patch);
      setDirects((list) => list.map(patch));
      if (message.conversationId !== selectedIdRef.current) return;
      stickToBottom.current = true;
      setMessages((current) =>
        current.some((item) => item.id === message.id) ? current : [...current, message],
      );
    }

    socket.on("message:new", onMessage);
    socket.on("connect", syncLive);
    socket.on("disconnect", syncLive);
    syncLive();

    return () => {
      socket.off("message:new", onMessage);
      socket.off("connect", syncLive);
      socket.off("disconnect", syncLive);
    };
  }, []);

  useEffect(() => {
    const socket = getChatSocket();
    const rooms = [
      inbox.community.conversationId,
      ...inbox.directs.map((item) => item.conversationId),
    ];

    function joinRooms() {
      for (const room of rooms) socket.emit("conversation:join", room);
    }

    socket.on("connect", joinRooms);
    if (socket.connected) joinRooms();

    return () => {
      socket.off("connect", joinRooms);
    };
  }, [inbox]);

  useEffect(() => {
    if (!stickToBottom.current) return;
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, selectedId]);

  function openConversation(item: ChatPreview) {
    stickToBottom.current = true;
    setSelectedId(item.conversationId);
    setChannel(item.kind === "group" ? "group" : "direct");
    setDraft("");
    setError("");
  }

  function sendMessage() {
    const body = draft.trim();
    if (!body || sending) return;
    const socket = getChatSocket();
    if (!socket.connected) {
      setError("Live chat is reconnecting. Try again in a moment.");
      return;
    }

    setSending(true);
    setError("");
    setDraft("");
    stickToBottom.current = true;
    socket.timeout(10000).emit(
      "message:send",
      { conversationId: selectedId, body },
      (err: Error | null, ack: unknown) => {
        const payload = ack as { ok?: boolean; message?: string } | undefined;
        setSending(false);
        if (err || !payload?.ok) {
          setDraft(body);
          setError(
            typeof payload?.message === "string" ? payload.message : "Could not send the message",
          );
        }
      },
    );
  }

  return (
    <main className="flex h-[calc(100dvh-7.5rem)] min-h-[32rem] flex-col">
      <div className="mb-4">
        <p className="text-[10px] font-semibold tracking-[0.2em] text-sky-500 uppercase">
          Messages
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-slate-800">Chat</h1>
        <p className="mt-1 text-sm text-sky-600">
          Talk with the reading community, or message a member directly.
        </p>
      </div>

      <section className="grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="flex min-h-0 flex-col border-b border-slate-200 lg:border-r lg:border-b-0">
          <div className="space-y-3 p-4">
            <div className="grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => openConversation(community)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  channel === "group" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Community
              </button>
              <button
                type="button"
                onClick={() => {
                  setChannel("direct");
                  if (selected.kind === "group" && directs[0]) openConversation(directs[0]);
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                  channel === "direct" ? "bg-white text-sky-700 shadow-sm" : "text-slate-500"
                }`}
              >
                Direct
              </button>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={channel === "group" ? "Search community" : "Search members"}
              className="input input-bordered w-full"
            />
          </div>

          <ul className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {conversations.length === 0 ? (
              <li className="px-3 py-6 text-sm text-slate-400">No conversations match.</li>
            ) : (
              conversations.map((item) => {
                const active = item.conversationId === selected.conversationId;
                return (
                  <li key={item.conversationId}>
                    <button
                      type="button"
                      onClick={() => openConversation(item)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left ${
                        active ? "bg-sky-50" : "hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${item.avatarColor}`}
                      >
                        {item.initials}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-slate-800">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[11px] text-slate-400">
                            {formatStamp(item.lastAt)}
                          </span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-slate-500">
                          {item.lastBody || item.subtitle}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <div className="flex min-h-0 flex-col">
          <header className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
            <span
              className={`flex size-11 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${selected.avatarColor}`}
            >
              {selected.initials}
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-slate-800">{selected.title}</h2>
              <p className="text-xs text-slate-500">
                {live ? "Live" : "Reconnecting"}
                {" · "}
                {selected.kind === "group"
                  ? `${selected.subtitle} · group chat`
                  : selected.isFriend
                    ? "Direct message · friend"
                    : "Direct message"}
              </p>
            </div>
          </header>

          <div
            ref={scroller}
            onScroll={() => {
              const node = scroller.current;
              if (!node) return;
              const distance = node.scrollHeight - node.scrollTop - node.clientHeight;
              stickToBottom.current = distance < 80;
            }}
            className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50 px-5 py-4"
          >
            {loading ? (
              <p className="text-sm text-slate-400">Loading messages…</p>
            ) : messages.length === 0 ? (
              <div className="flex h-full items-center justify-center">
                <p className="max-w-xs text-center text-sm text-slate-400">
                  {selected.kind === "group"
                    ? "This is the community room. Share what you are reading."
                    : `Start a conversation with ${selected.title}.`}
                </p>
              </div>
            ) : (
              messages.map((message, index) => {
                const mine = message.senderId === inbox.viewerId;
                const previous = messages[index - 1];
                const showName = !mine && previous?.senderId !== message.senderId;
                return (
                  <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`flex max-w-[80%] gap-2 ${mine ? "flex-row-reverse" : ""}`}>
                      {!mine && (
                        <span
                          className={`mt-5 flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${message.avatarColor}`}
                        >
                          {message.initials}
                        </span>
                      )}
                      <div>
                        {showName && (
                          <p className="mb-1 text-[11px] font-semibold text-slate-500">
                            {message.senderName}
                          </p>
                        )}
                        <div
                          className={`rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                            mine
                              ? "rounded-br-md bg-sky-500 text-white"
                              : "rounded-bl-md bg-white text-slate-800 shadow-sm"
                          }`}
                        >
                          {message.body}
                        </div>
                        <p
                          className={`mt-1 text-[10px] text-slate-400 ${mine ? "text-right" : ""}`}
                        >
                          {formatStamp(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form
            className="border-t border-slate-200 p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage();
            }}
          >
            {error && <p className="mb-2 text-xs text-rose-500">{error}</p>}
            <div className="flex items-end gap-2">
              <textarea
                value={draft}
                rows={1}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder={
                  selected.kind === "group"
                    ? "Message the community"
                    : `Message ${selected.title}`
                }
                className="textarea textarea-bordered max-h-32 min-h-11 flex-1 resize-none"
              />
              <button type="submit" disabled={sending || !draft.trim()} className="btn btn-primary">
                Send
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
