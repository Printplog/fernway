"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Clock,
  Headphones,
  LoaderCircle,
  MessageCircle,
  Plus,
  Send,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  sendSupportTyping,
  type SupportMessageEntry,
  type SupportThread,
  type SupportTypingEvent,
} from "@/api/support";
import {
  supportKeys,
  useCreateSupportThread,
  useSendSupportReply,
  useSupportRealtime,
  useSupportThreads,
} from "@/hooks/support/useSupport";
import { cn } from "@/lib/utils";

const QUICK_TOPICS = [
  "Transfer status",
  "Debit card help",
  "Account balance",
  "General question",
] as const;

const TYPING_EXPIRE_MS = 5500;
const TYPING_PING_INTERVAL_MS = 2400;
const TYPING_IDLE_STOP_MS = 3000;

type WidgetView = "list" | "new" | "thread";

type OptimisticEntry = SupportMessageEntry & {
  threadId: string;
  pending?: boolean;
};

function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function ThreadStatusBadge({ thread }: { thread: SupportThread }) {
  const hasOwnerReply = thread.conversation.some((entry) => entry.direction === "owner");
  if (thread.status === "closed") {
    return (
      <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
        Closed
      </span>
    );
  }
  if (hasOwnerReply) {
    return (
      <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
        Replied
      </span>
    );
  }
  return (
    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
      Open
    </span>
  );
}

function AgentAvatar({
  avatarUrl,
  name,
  size = "md",
  online = false,
}: {
  avatarUrl?: string | null;
  name: string;
  size?: "sm" | "md";
  online?: boolean;
}) {
  const dims = size === "sm" ? "size-7" : "size-9";
  const iconDims = size === "sm" ? "size-3.5" : "size-4";
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={cn(
          "grid place-items-center overflow-hidden rounded-full bg-emerald-500/20 text-emerald-300 ring-1 ring-white/15",
          dims,
        )}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name} className="size-full object-cover" />
        ) : (
          <Headphones className={iconDims} aria-hidden="true" />
        )}
      </span>
      {online && (
        <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-[#0d231c] bg-emerald-400" />
      )}
    </span>
  );
}

export function SupportWidget() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, refetch } = useSupportThreads();
  const createMutation = useCreateSupportThread();
  const replyMutation = useSendSupportReply();

  const [open, setOpen] = useState(false);
  const [viewOverride, setViewOverride] = useState<WidgetView | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [pendingEntries, setPendingEntries] = useState<OptimisticEntry[]>([]);
  const [hasUnreadReply, setHasUnreadReply] = useState(false);
  const [agentTyping, setAgentTyping] = useState<{ threadId: string; name: string } | null>(null);

  const openRef = useRef(open);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const agentTypingTimerRef = useRef<number | null>(null);
  const isEmittingTypingRef = useRef(false);
  const lastTypingPingRef = useRef(0);
  const stopTypingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  const threads = useMemo(() => data?.results ?? [], [data?.results]);
  const realtimeEnabled = Boolean(data?.realtime?.enabled);

  const activeThread = useMemo(() => {
    if (selectedId) {
      return threads.find((item) => item.id === selectedId) ?? threads[0] ?? null;
    }
    return threads[0] ?? null;
  }, [selectedId, threads]);

  const activeThreadId = activeThread?.id;
  const activeThreadStatus = activeThread?.status;

  const supportProfile = activeThread?.support_profile ?? data?.support_profile;
  const agentName = supportProfile?.display_name?.trim() || "Support";
  const agentAvatarUrl = supportProfile?.avatar_url ?? null;

  const view: WidgetView = viewOverride ?? (threads.length > 0 ? "thread" : "new");

  const clearAgentTyping = useCallback(() => {
    if (agentTypingTimerRef.current !== null) {
      window.clearTimeout(agentTypingTimerRef.current);
      agentTypingTimerRef.current = null;
    }
    setAgentTyping(null);
  }, []);

  const stopCustomerTyping = useCallback((threadId?: string) => {
    if (stopTypingTimerRef.current !== null) {
      window.clearTimeout(stopTypingTimerRef.current);
      stopTypingTimerRef.current = null;
    }
    if (isEmittingTypingRef.current && threadId) {
      isEmittingTypingRef.current = false;
      lastTypingPingRef.current = 0;
      void sendSupportTyping(threadId, false).catch(() => {});
    } else {
      isEmittingTypingRef.current = false;
      lastTypingPingRef.current = 0;
    }
  }, []);

  const notifyCustomerTyping = useCallback(
    (hasText: boolean) => {
      if (!activeThreadId || activeThreadStatus === "closed" || !realtimeEnabled) return;

      if (!hasText) {
        stopCustomerTyping(activeThreadId);
        return;
      }

      const now = Date.now();
      if (!isEmittingTypingRef.current || now - lastTypingPingRef.current >= TYPING_PING_INTERVAL_MS) {
        isEmittingTypingRef.current = true;
        lastTypingPingRef.current = now;
        void sendSupportTyping(activeThreadId, true).catch(() => {});
      }

      if (stopTypingTimerRef.current !== null) {
        window.clearTimeout(stopTypingTimerRef.current);
      }
      stopTypingTimerRef.current = window.setTimeout(() => {
        stopTypingTimerRef.current = null;
        if (isEmittingTypingRef.current) {
          isEmittingTypingRef.current = false;
          lastTypingPingRef.current = 0;
          void sendSupportTyping(activeThreadId, false).catch(() => {});
        }
      }, TYPING_IDLE_STOP_MS);
    },
    [activeThreadId, activeThreadStatus, realtimeEnabled, stopCustomerTyping],
  );

  // Stop outgoing typing when switching threads or unmounting
  useEffect(() => {
    return () => {
      stopCustomerTyping(activeThreadId);
    };
  }, [activeThreadId, stopCustomerTyping]);

  useEffect(() => {
    if (!open && activeThreadId) {
      stopCustomerTyping(activeThreadId);
    }
  }, [activeThreadId, open, stopCustomerTyping]);

  // Auto-grow reply textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [reply]);

  const handleRealtimeUpdate = useCallback(() => {
    clearAgentTyping();
    void queryClient.invalidateQueries({ queryKey: supportKeys.all });
    if (!openRef.current) {
      setHasUnreadReply(true);
    }
  }, [clearAgentTyping, queryClient]);

  const handleRealtimeTyping = useCallback(
    (event: SupportTypingEvent) => {
      if (event.sender !== "owner") return;
      if (activeThreadId && event.ticket_id !== activeThreadId) return;

      if (!event.is_typing) {
        clearAgentTyping();
        return;
      }

      if (agentTypingTimerRef.current !== null) {
        window.clearTimeout(agentTypingTimerRef.current);
      }
      const nextName = event.sender_name?.trim() || agentName;
      setAgentTyping({ threadId: event.ticket_id, name: nextName });
      agentTypingTimerRef.current = window.setTimeout(() => {
        agentTypingTimerRef.current = null;
        setAgentTyping(null);
      }, TYPING_EXPIRE_MS);
    },
    [activeThreadId, agentName, clearAgentTyping],
  );

  useSupportRealtime({
    config: data?.realtime,
    threadId: activeThreadId,
    channel: activeThread?.channel,
    onUpdate: handleRealtimeUpdate,
    onTyping: handleRealtimeTyping,
  });

  const combinedConversation = useMemo<OptimisticEntry[]>(() => {
    const base = (activeThread?.conversation ?? []).map((entry) => ({
      ...entry,
      threadId: activeThreadId ?? "",
    }));
    const pendingForThread = pendingEntries.filter((item) => item.threadId === activeThreadId);
    if (!pendingForThread.length) return base;
    return [...base, ...pendingForThread];
  }, [activeThread?.conversation, activeThreadId, pendingEntries]);

  const isAgentTypingActive = Boolean(
    agentTyping && activeThreadId && agentTyping.threadId === activeThreadId,
  );

  useEffect(() => {
    if (!open) return;
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeThreadId, combinedConversation.length, isAgentTypingActive, open, view]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const toggleOpen = () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        setHasUnreadReply(false);
      }
      return next;
    });
  };

  const showConversationList = () => {
    stopCustomerTyping(activeThread?.id);
    setReply("");
    setViewOverride("list");
  };

  const showNewConversation = () => {
    stopCustomerTyping(activeThread?.id);
    setSubject("");
    setMessage("");
    setViewOverride("new");
  };

  const openConversation = (id: string) => {
    stopCustomerTyping(activeThread?.id);
    setSelectedId(id);
    setReply("");
    setViewOverride("thread");
  };

  const startConversation = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || createMutation.isPending) return;

    try {
      const created = await createMutation.mutateAsync({
        subject: subject.trim() || "Banking support request",
        message: trimmedMessage,
      });
      setSubject("");
      setMessage("");
      setSelectedId(created.id);
      setViewOverride("thread");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Could not start the conversation. Try again.");
    }
  };

  const sendReply = async (event?: FormEvent) => {
    event?.preventDefault();
    const trimmed = reply.trim();
    if (!activeThread || !trimmed || replyMutation.isPending) return;

    stopCustomerTyping(activeThread.id);
    const tempId = `pending-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setPendingEntries((prev) => [
      ...prev,
      {
        id: tempId,
        threadId: activeThread.id,
        direction: "customer",
        body: trimmed,
        delivery_status: "received",
        created_at: new Date().toISOString(),
        pending: true,
      },
    ]);
    setReply("");

    try {
      await replyMutation.mutateAsync({
        threadId: activeThread.id,
        body: trimmed,
      });
      setPendingEntries((prev) => prev.filter((item) => item.id !== tempId));
    } catch (error: unknown) {
      setPendingEntries((prev) => prev.filter((item) => item.id !== tempId));
      setReply((current) => (current ? current : trimmed));
      toast.error(error instanceof Error ? error.message : "Your message could not be sent. Try again.");
    }
  };

  const headerTitle =
    view === "list"
      ? "Your conversations"
      : view === "new"
        ? supportProfile?.display_name?.trim() || "New conversation"
        : activeThread?.subject || agentName;

  const isTypingVisible = view === "thread" && isAgentTypingActive && activeThreadStatus !== "closed";
  const typingDisplayName = (isAgentTypingActive && agentTyping?.name) || agentName;

  return (
    <div className="fixed right-4 bottom-20 z-50 md:right-6 md:bottom-6">
      {open && (
        <section
          aria-label="Banking support conversation"
          className="mb-3 flex h-[min(560px,calc(100dvh-11rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-emerald-950/15 bg-card shadow-[0_24px_80px_rgba(6,40,28,0.26)] dark:border-border dark:shadow-[0_24px_80px_rgba(0,0,0,0.58)] md:h-[min(640px,calc(100dvh-7rem))]"
        >
          <header className="flex items-center justify-between border-b border-white/10 bg-[#0d231c] px-3 py-3 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              {view !== "list" && threads.length > 0 && (
                <button
                  type="button"
                  onClick={showConversationList}
                  aria-label="Back to conversations"
                  className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft className="size-4" />
                </button>
              )}
              <AgentAvatar
                avatarUrl={agentAvatarUrl}
                name={agentName}
                size="md"
                online={realtimeEnabled}
              />
              <div className="min-w-0">
                <p className="truncate font-heading text-sm font-semibold">{headerTitle}</p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-white/60">
                  {isTypingVisible ? (
                    <span className="truncate font-medium text-emerald-300">
                      {typingDisplayName} is typing...
                    </span>
                  ) : (
                    <>
                      {view === "thread" && realtimeEnabled && (
                        <span className="inline-block size-1.5 shrink-0 rounded-full bg-emerald-400" />
                      )}
                      <span className="truncate">
                        {view === "thread"
                          ? realtimeEnabled
                            ? `${agentName} · Live conversation`
                            : "Lindenway banking support"
                          : "Help with your Lindenway account"}
                      </span>
                    </>
                  )}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close support"
              className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-white/65 transition hover:bg-white/10 hover:text-white"
            >
              <X className="size-4" />
            </button>
          </header>

          {view === "list" ? (
            <div className="flex flex-1 flex-col overflow-hidden bg-muted/35 dark:bg-background/70">
              <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
                <p className="text-xs text-muted-foreground">Continue a previous request</p>
                <button
                  type="button"
                  onClick={showNewConversation}
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:opacity-95"
                >
                  <Plus className="size-3.5" />
                  New chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                <div className="space-y-2">
                  {threads.map((item) => {
                    const lastEntry = item.conversation[item.conversation.length - 1];
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openConversation(item.id)}
                        className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary/40 hover:bg-primary/5"
                      >
                        <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-lg bg-primary/10 text-primary">
                          {agentAvatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={agentAvatarUrl} alt={agentName} className="size-full object-cover" />
                          ) : (
                            <MessageCircle className="size-4" />
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium text-foreground">
                              {item.subject}
                            </span>
                            <ThreadStatusBadge thread={item} />
                          </span>
                          <span className="mt-1 block truncate text-xs text-muted-foreground">
                            {lastEntry
                              ? `${lastEntry.direction === "owner" ? `${agentName}: ` : "You: "}${lastEntry.body}`
                              : "Open conversation"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : view === "thread" ? (
            <>
              <div
                ref={scrollRef}
                className="flex-1 space-y-3 overflow-y-auto bg-muted/35 p-4 dark:bg-background/70"
              >
                {isPending ? (
                  <div className="grid h-full place-items-center">
                    <LoaderCircle className="size-5 animate-spin text-primary" />
                  </div>
                ) : isError && !activeThread ? (
                  <div className="grid h-full place-items-center text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">The conversation could not load.</p>
                      <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-3 cursor-pointer text-sm font-semibold text-primary hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  </div>
                ) : activeThread ? (
                  <>
                    {combinedConversation.map((entry) => {
                      const isCustomer = entry.direction === "customer";
                      return (
                        <article
                          key={entry.id}
                          className={cn("flex items-end gap-2", isCustomer ? "justify-end" : "justify-start")}
                        >
                          {!isCustomer && (
                            <AgentAvatar avatarUrl={agentAvatarUrl} name={agentName} size="sm" />
                          )}
                          <div
                            className={cn(
                              "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6",
                              isCustomer
                                ? "rounded-br-md bg-[#0d231c] text-white dark:bg-primary dark:text-primary-foreground"
                                : "rounded-bl-md border border-border bg-card text-foreground",
                              entry.pending && "opacity-75",
                            )}
                          >
                            <p className="whitespace-pre-wrap break-words">{entry.body}</p>
                            <p
                              className={cn(
                                "mt-1 flex items-center gap-1 text-[10px]",
                                isCustomer
                                  ? "text-white/65 dark:text-primary-foreground/75"
                                  : "text-muted-foreground",
                              )}
                            >
                              <span>{isCustomer ? "You" : agentName}</span>
                              <span>·</span>
                              {entry.pending ? (
                                <span className="inline-flex items-center gap-1">
                                  <Clock className="size-2.5" />
                                  Sending
                                </span>
                              ) : (
                                <span>{formatTime(entry.created_at)}</span>
                              )}
                            </p>
                          </div>
                        </article>
                      );
                    })}

                    {isTypingVisible && (
                      <div className="flex items-end gap-2" role="status" aria-live="polite">
                        <AgentAvatar avatarUrl={agentAvatarUrl} name={typingDisplayName} size="sm" />
                        <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1" aria-hidden="true">
                            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                          </span>
                          <span>{typingDisplayName} is typing...</span>
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {activeThread?.status === "closed" ? (
                <div className="flex items-center justify-between gap-3 border-t border-border bg-card px-4 py-3 text-xs text-muted-foreground">
                  <span>This conversation is closed.</span>
                  <button
                    type="button"
                    onClick={showNewConversation}
                    className="inline-flex h-8 cursor-pointer items-center gap-1 rounded-lg bg-primary px-3 text-xs font-semibold text-primary-foreground"
                  >
                    <Plus className="size-3.5" />
                    New chat
                  </button>
                </div>
              ) : (
                <form onSubmit={sendReply} className="border-t border-border bg-card p-3">
                  <div className="flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-primary">
                    <textarea
                      ref={textareaRef}
                      aria-label="Message support"
                      rows={1}
                      maxLength={10000}
                      value={reply}
                      onChange={(event) => {
                        const next = event.target.value;
                        setReply(next);
                        notifyCustomerTyping(Boolean(next.trim()));
                      }}
                      onBlur={() => stopCustomerTyping(activeThread?.id)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                          event.preventDefault();
                          void sendReply();
                        }
                      }}
                      placeholder="Write a message"
                      className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      disabled={replyMutation.isPending || !reply.trim()}
                      aria-label="Send message"
                      className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-lg bg-primary text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {replyMutation.isPending ? (
                        <LoaderCircle className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <form
              onSubmit={startConversation}
              className="flex flex-1 flex-col justify-center overflow-y-auto bg-card p-5 text-foreground"
            >
              <div>
                <h2 className="font-heading text-lg font-semibold">How can we help?</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Start a live conversation with {supportProfile?.display_name?.trim() || "Lindenway banking support"}.
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {QUICK_TOPICS.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSubject(topic)}
                    className={cn(
                      "cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                      subject === topic
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject (e.g. Transfer status)"
                maxLength={160}
                className="mt-4 h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary"
              />

              <textarea
                required
                rows={4}
                maxLength={5000}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tell us what you need help with..."
                className="mt-3 w-full resize-none rounded-lg border border-border bg-background px-3 py-2.5 text-sm leading-5 text-foreground outline-none transition focus:border-primary"
              />

              <button
                type="submit"
                disabled={createMutation.isPending || !message.trim()}
                className="mt-4 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMutation.isPending ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                {createMutation.isPending ? "Sending..." : "Start conversation"}
              </button>
            </form>
          )}
        </section>
      )}

      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        aria-label={open ? "Close banking support" : "Open banking support"}
        className="relative ml-auto grid size-14 cursor-pointer place-items-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_35px_rgba(5,150,105,0.34)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(5,150,105,0.42)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {open ? (
          <X className="size-5" />
        ) : agentAvatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={agentAvatarUrl} alt={agentName} className="size-full object-cover" />
        ) : threads.length > 0 ? (
          <MessageCircle className="size-5" />
        ) : (
          <Headphones className="size-5" />
        )}
        {!open && hasUnreadReply && (
          <span aria-label="New support reply" className="absolute top-1.5 right-1.5 flex size-3.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-3.5 rounded-full border-2 border-background bg-amber-400" />
          </span>
        )}
      </button>
    </div>
  );
}
