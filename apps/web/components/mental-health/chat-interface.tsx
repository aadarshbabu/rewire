"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  PhoneCall,
  Wind,
  ShieldCheck,
  Heart,
  Brain,
  MessageSquare,
  Copy,
  Check,
  RefreshCw,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { CrisisModal } from "./crisis-modal";
import { BreathingWidget } from "./breathing-widget";
import { MarkdownRenderer } from "./markdown-renderer";
import { UserButton } from "@/components/auth/user-button";
import { useSession } from "@/lib/auth-client";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt?: string | Date;
  isStreaming?: boolean;
  statusText?: string;
}

interface ConversationItem {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  messages?: { content: string; createdAt: string }[];
}

const CONVERSATION_STARTERS = [
  {
    icon: Wind,
    title: "Grounding & Anxiety",
    prompt: "I'm feeling overwhelmed and my mind is racing. Can you guide me through a gentle grounding exercise?",
  },
  {
    icon: Brain,
    title: "Cognitive Reframing",
    prompt: "I'm stuck in a loop of self-critical thoughts after today. Can you help me look at this from a kinder perspective?",
  },
  {
    icon: Heart,
    title: "Emotional Venting",
    prompt: "I had an exhausting day and I just need a safe space to vent without being judged.",
  },
  {
    icon: Clock,
    title: "Sleep & Wind-Down",
    prompt: "I can't seem to turn off my brain to sleep tonight. Can you help me wind down peacefully?",
  },
];

interface ChatInterfaceProps {
  initialChatId?: string;
}

export function ChatInterface({ initialChatId }: ChatInterfaceProps = {}) {
  const router = useRouter();
  const params = useParams();
  const routeChatId = (params?.chatId as string) || initialChatId;
  const loadedConversationIdRef = useRef<string | null>(null);

  const { data: session } = useSession();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(routeChatId || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeStepText, setActiveStepText] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive default: collapse sidebar on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, []);

  // Modals & Tools
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState(false);
  const [showBreathingWidget, setShowBreathingWidget] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeEventSourceRef = useRef<EventSource | null>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeStepText]);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (activeEventSourceRef.current) {
        activeEventSourceRef.current.close();
      }
    };
  }, []);

  // Fetch conversations list
  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      if (!res.ok) return;
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        // If landed on /chat without a specific conversation ID and user has past conversations:
        // Automatically redirect to the latest conversation
        if (!routeChatId && !currentConversationId && data.conversations.length > 0) {
          router.replace(`/chat/${data.conversations[0].id}`);
        }
      }
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchConversations();
    }
  }, [session?.user]);

  // Load a conversation and its messages
  const loadConversationMessages = async (id: string) => {
    if (activeEventSourceRef.current) {
      activeEventSourceRef.current.close();
      activeEventSourceRef.current = null;
    }
    setIsStreaming(false);
    setActiveStepText(null);
    setCurrentConversationId(id);

    try {
      setIsLoading(true);
      const res = await fetch(`/api/conversations/${id}`);
      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          router.replace("/chat");
        }
        return;
      }
      const data = await res.json();
      if (data.conversation && data.conversation.messages) {
        setMessages(data.conversation.messages);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load conversation details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronize when routeChatId changes
  useEffect(() => {
    if (routeChatId) {
      if (loadedConversationIdRef.current !== routeChatId) {
        loadedConversationIdRef.current = routeChatId;
        loadConversationMessages(routeChatId);
      }
    } else {
      loadedConversationIdRef.current = null;
      setCurrentConversationId(null);
      setMessages([]);
    }
  }, [routeChatId]);

  // Select a conversation from sidebar
  const handleSelectConversation = (id: string) => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    if (id === currentConversationId) return;
    router.push(`/chat/${id}`);
  };

  // Create a new conversation
  const handleCreateNewConversation = async () => {
    if (!session?.user) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
    if (activeEventSourceRef.current) {
      activeEventSourceRef.current.close();
      activeEventSourceRef.current = null;
    }
    setIsStreaming(false);
    setActiveStepText(null);

    try {
      setIsLoading(true);
      const res = await fetch("/api/conversations", { method: "POST" });
      if (!res.ok) return;
      const data = await res.json();
      if (data.conversation) {
        setConversations((prev) => [data.conversation, ...prev]);
        setCurrentConversationId(data.conversation.id);
        loadedConversationIdRef.current = data.conversation.id;
        setMessages([]);
        router.push(`/chat/${data.conversation.id}`);
      }
    } catch (err) {
      console.error("Failed to create conversation:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a conversation
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/conversations/${id}`, { method: "DELETE" });
      if (res.ok) {
        const remaining = conversations.filter((c) => c.id !== id);
        setConversations(remaining);
        if (currentConversationId === id) {
          if (remaining.length > 0) {
            router.push(`/chat/${remaining[0].id}`);
          } else {
            loadedConversationIdRef.current = null;
            setCurrentConversationId(null);
            setMessages([]);
            router.push("/chat");
          }
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation:", err);
    }
  };

  // Send message and stream response via dedicated SSE endpoint
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isStreaming) return;

    // If no active conversation, create one first
    let conversationId = currentConversationId;
    if (!conversationId) {
      try {
        const createRes = await fetch("/api/conversations", { method: "POST" });
        if (!createRes.ok) return;
        const createData = await createRes.json();
        conversationId = createData.conversation.id;
        setCurrentConversationId(conversationId);
        loadedConversationIdRef.current = conversationId;
        setConversations((prev) => [createData.conversation, ...prev]);
        // Update URL to /chat/:chatId immediately without remounting or interrupting stream
        window.history.replaceState(null, "", `/chat/${conversationId}`);
      } catch (err) {
        console.error("Failed to initiate conversation:", err);
        return;
      }
    }

    if (!conversationId) return;

    setInputMessage("");

    // 1. Optimistic User Message
    const tempUserMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: tempUserMsgId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    // 2. Optimistic Assistant Message placeholder
    const tempAiMsgId = `ai-${Date.now()}`;
    const assistantMsg: Message = {
      id: tempAiMsgId,
      role: "assistant",
      content: "",
      isStreaming: true,
      statusText: "Connecting with Rewire companion...",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setIsStreaming(true);
    setActiveStepText("Connecting...");

    try {
      // 3. Post user message to backend (saves message, creates AiRun in queued state, enqueues SQS)
      const postRes = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!postRes.ok) {
        const errData = await postRes.json();
        throw new Error(errData.error || "Failed to send message");
      }

      const { runId } = await postRes.json();

      if (!runId) {
        throw new Error("No runId returned from server");
      }

      // 4. Open dedicated per-run SSE connection to Redis Stream
      if (activeEventSourceRef.current) {
        activeEventSourceRef.current.close();
      }

      const eventSource = new EventSource(`/api/ai/runs/${runId}/stream`);
      activeEventSourceRef.current = eventSource;

      eventSource.addEventListener("run.started", () => {
        setActiveStepText("Reflecting on your message...");
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAiMsgId ? { ...msg, statusText: "Reflecting on your message..." } : msg
          )
        );
      });

      eventSource.addEventListener("node.started", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          let label = "Processing...";
          if (data.node === "assessSafety" || data.node === "safety") {
            label = "Validating emotional safety...";
          } else if (data.node === "neo4jRag" || data.node === "retrieval") {
            label = "Drawing coping insights...";
          } else if (data.node === "generate") {
            label = "Crafting compassionate response...";
          }
          setActiveStepText(label);
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener("message.delta", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          const chunk = data.content || "";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMsgId
                ? {
                  ...msg,
                  content: msg.content + chunk,
                  statusText: undefined,
                }
                : msg
            )
          );
        } catch {
          // ignore
        }
      });

      eventSource.addEventListener("run.completed", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMsgId
                ? {
                  ...msg,
                  content: data.content || msg.content,
                  isStreaming: false,
                  statusText: undefined,
                }
                : msg
            )
          );
        } catch {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMsgId ? { ...msg, isStreaming: false, statusText: undefined } : msg
            )
          );
        } finally {
          eventSource.close();
          activeEventSourceRef.current = null;
          setIsStreaming(false);
          setActiveStepText(null);
          fetchConversations(); // update snippet
        }
      });

      eventSource.addEventListener("run.failed", (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === tempAiMsgId
                ? {
                  ...msg,
                  content:
                    msg.content ||
                    data.error ||
                    "I ran into an unexpected difficulty, but I'm here. Would you like to try again?",
                  isStreaming: false,
                  statusText: undefined,
                }
                : msg
            )
          );
        } finally {
          eventSource.close();
          activeEventSourceRef.current = null;
          setIsStreaming(false);
          setActiveStepText(null);
        }
      });

      eventSource.onerror = () => {
        // SSE connection error or closed by server
        eventSource.close();
        activeEventSourceRef.current = null;
        setIsStreaming(false);
        setActiveStepText(null);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempAiMsgId && !msg.content
              ? {
                ...msg,
                content:
                  "I'm here with you. If the response stream took a moment, you can refresh or send another thought whenever you're ready.",
                isStreaming: false,
                statusText: undefined,
              }
              : { ...msg, isStreaming: false, statusText: undefined }
          )
        );
      };
    } catch (err: any) {
      console.error("Error sending message:", err);
      setIsStreaming(false);
      setActiveStepText(null);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempAiMsgId
            ? {
              ...msg,
              content:
                "I'm sorry, I could not complete that reflection. Please make sure the service is active and try again.",
              isStreaming: false,
              statusText: undefined,
            }
            : msg
        )
      );
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Crisis Modal */}
      <CrisisModal isOpen={isCrisisModalOpen} onClose={() => setIsCrisisModalOpen(false)} />

      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity md:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar: Conversation Sessions */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full flex-col border-r border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all duration-300 ease-in-out dark:border-zinc-800/80 dark:bg-zinc-900/95 md:relative md:z-30 md:bg-white/70 md:dark:bg-zinc-900/60 ${isSidebarOpen
          ? "w-72 translate-x-0"
          : "-translate-x-full md:translate-x-0 md:w-16"
          }`}
      >
        {/* Expanded Sidebar Content */}
        <div
          className={`flex h-full w-72 flex-col justify-between transition-opacity duration-200 ${isSidebarOpen ? "opacity-100" : "hidden opacity-0 pointer-events-none"
            }`}
        >
          {/* Upper section: Header + Conversation List */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 group hover:opacity-85 transition-opacity"
                title="Go to Home"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white shadow-sm group-hover:scale-105 transition-transform">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Rewire
                </span>
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCreateNewConversation}
                  className="flex items-center gap-1 rounded-lg bg-teal-50 px-2.5 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900 transition-colors cursor-pointer"
                  title="Start new reflection session"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>New</span>
                </button>

                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                  title="Collapse sidebar"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                  No previous conversations yet. Click &quot;New&quot; to begin your first reflection.
                </div>
              ) : (
                conversations.map((conv) => {
                  const isSelected = conv.id === currentConversationId;
                  const preview = conv.messages?.[0]?.content || "New conversation";
                  const time = new Date(conv.updatedAt || conv.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`group relative flex cursor-pointer items-start justify-between rounded-xl p-3 text-left transition-all ${isSelected
                        ? "bg-teal-50/90 text-teal-950 shadow-sm dark:bg-teal-950/40 dark:text-teal-100 border border-teal-200 dark:border-teal-800/50"
                        : "hover:bg-zinc-100/80 text-zinc-700 dark:hover:bg-zinc-800/50 dark:text-zinc-300"
                        }`}
                    >
                      <div className="flex items-start gap-2.5 overflow-hidden">
                        <MessageSquare className={`h-4 w-4 shrink-0 mt-0.5 ${isSelected ? "text-teal-600 dark:text-teal-400" : "text-zinc-400"}`} />
                        <div className="overflow-hidden">
                          <p className="truncate text-xs font-medium leading-snug">
                            {preview}
                          </p>
                          <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            {time}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-600 p-1 rounded transition-opacity"
                        title="Delete session"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Lower section: Calming Quick Tools + User Profile */}
          <div className="shrink-0 border-t border-zinc-200/80 dark:border-zinc-800/80">


            {/* User Profile in Lower Section */}
            <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/30">
              <UserButton dropUp fullWidth />
            </div>
          </div>
        </div>

        {/* Collapsed Sidebar Rail (ChatGPT style) */}
        <div
          className={`hidden md:flex h-full w-16 flex-col justify-between items-center py-3.5 overflow-visible transition-opacity duration-200 ${!isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none md:hidden"
            }`}
        >
          {/* Top section: Logo hover-to-expand + Actions */}
          <div className="flex flex-col items-center gap-3 w-full">
            {/* Logo Button: transforms to expand icon on hover */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-all cursor-pointer"
              title="Expand sidebar"
              aria-label="Expand sidebar"
            >
              {/* Default state: Logo / Heart */}
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm transition-all duration-200 group-hover:scale-50 group-hover:opacity-0">
                <Heart className="h-4 w-4" />
              </div>

              {/* Hover state: Expand Icon */}
              <div className="absolute inset-0 flex items-center justify-center transition-all duration-200 scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200/80 bg-white shadow-xs dark:border-zinc-700 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                  <PanelLeftOpen className="h-4 w-4" />
                </div>
              </div>
            </button>

            <div className="h-[1px] w-7 bg-zinc-200/80 dark:bg-zinc-800/80" />

            {/* New Reflection Button */}
            <button
              onClick={handleCreateNewConversation}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 hover:bg-teal-50 hover:text-teal-700 dark:text-zinc-400 dark:hover:bg-teal-950/50 dark:hover:text-teal-300 transition-colors cursor-pointer"
              title="New reflection"
              aria-label="New reflection"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* Reflections / History button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors cursor-pointer"
              title="View reflections"
              aria-label="View reflections"
            >
              <MessageSquare className="h-4 w-4" />
            </button>

            {/* Box Breathing Tool */}
            <button
              onClick={() => setShowBreathingWidget(!showBreathingWidget)}
              className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors cursor-pointer ${showBreathingWidget
                ? "bg-teal-100 text-teal-700 dark:bg-teal-950/70 dark:text-teal-300"
                : "text-zinc-600 hover:bg-teal-50 hover:text-teal-700 dark:text-zinc-400 dark:hover:bg-teal-950/40 dark:hover:text-teal-300"
                }`}
              title="Box Breathing Calm"
              aria-label="Box Breathing Calm"
            >
              <Wind className="h-4 w-4" />
            </button>

            {/* Crisis Hotline Tool */}
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Crisis Resources (988)"
              aria-label="Crisis Resources (988)"
            >
              <PhoneCall className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom section: User Button Avatar (matches ChatGPT user circle at bottom) */}
          <div className="flex items-center justify-center pt-2 relative overflow-visible">
            <UserButton dropUp collapsed />
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Chat Header */}
        <header className="h-14 shrink-0 border-b border-zinc-200/80 bg-white/70 px-4 md:px-6 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/70 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">

            <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-500/20">
              <Sparkles className="h-4 w-4" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
            </div>
            <div>
              <h1 className="text-sm font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <span>Rewire Companion</span>
                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-800 dark:bg-teal-950/60 dark:text-teal-300">
                  Active
                </span>
              </h1>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Empathetic reflection & evidence-informed coping
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Toggle for Breathing Widget */}
            <button
              onClick={() => setShowBreathingWidget(!showBreathingWidget)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            >
              <Wind className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden sm:inline">Calm Breath</span>
            </button>

            {/* Emergency Crisis Button */}
            <button
              onClick={() => setIsCrisisModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 shadow-sm hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/50 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span>Need Help? (988)</span>
            </button>
          </div>
        </header>

        {/* Optional Floating / Top Breathing Widget */}
        {showBreathingWidget && (
          <div className="p-4 bg-teal-50/60 border-b border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/40 flex justify-center animate-in slide-in-from-top duration-300">
            <BreathingWidget onClose={() => setShowBreathingWidget(false)} compact />
          </div>
        )}

        {/* Messages List Area */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
          {isLoading && messages.length === 0 ? (
            <div className="flex h-full min-h-[340px] flex-col items-center justify-center gap-3 text-zinc-400">
              <RefreshCw className="h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
              <p className="text-xs font-medium">Loading reflection session...</p>
            </div>
          ) : messages.length === 0 ? (
            /* Empty State: Warm Mental Health Welcoming */
            <div className="mx-auto max-w-2xl text-center py-10 space-y-8 animate-in fade-in duration-300">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-teal-500/20 via-emerald-500/15 to-cyan-500/20 border border-teal-200 dark:border-teal-800/60 shadow-md shadow-teal-500/10">
                <Heart className="h-8 w-8 text-teal-600 dark:text-teal-400" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Welcome to Rewire
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-md mx-auto leading-relaxed">
                  I&apos;m your empathetic AI companion. Whatever you&apos;re experiencing right now—anxiety, grief, stress, or just need to think out loud—you are safe here.
                </p>
              </div>

              {/* Starter Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {CONVERSATION_STARTERS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(item.prompt)}
                      className="group rounded-2xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition-all hover:border-teal-500/40 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 text-left flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400 group-hover:scale-105 transition-transform">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {item.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Render Messages */
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    {!isUser && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-sm">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}

                    <div
                      className={`relative group max-w-[85%] rounded-2xl px-4 py-3.5 text-sm leading-relaxed shadow-sm transition-all ${isUser
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-br-none"
                        : "border border-zinc-200/80 bg-white/90 text-zinc-800 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:text-zinc-100 rounded-bl-none backdrop-blur-sm"
                        }`}
                    >
                      {/* Live status badge during generation */}
                      {msg.statusText && (
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-teal-600 dark:text-teal-400">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>{msg.statusText}</span>
                        </div>
                      )}

                      {/* Message Content */}
                      {isUser ? (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      ) : (
                        <MarkdownRenderer content={msg.content} />
                      )}

                      {/* Streaming cursor indicator */}
                      {msg.isStreaming && (
                        <span className="inline-block h-4 w-1.5 animate-pulse bg-teal-500 ml-1 align-middle" />
                      )}

                      {/* Action buttons on hover (Copy, etc.) */}
                      {!isUser && msg.content && !msg.isStreaming && (
                        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-[11px] text-zinc-400">
                          <span>Rewire Companion</span>
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                            title="Copy response"
                          >
                            {copiedMessageId === msg.id ? (
                              <>
                                <Check className="h-3 w-3 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <div className="shrink-0 border-t border-zinc-200/80 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
          <div className="mx-auto max-w-3xl">
            {/* Active streaming status pill if processing */}
            {activeStepText && (
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50/80 px-3 py-1 text-xs font-medium text-teal-800 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-300">
                <RefreshCw className="h-3 w-3 animate-spin" />
                <span>{activeStepText}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative flex items-center"
            >
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                rows={1}
                placeholder="Share whatever is on your mind... you are safe and heard."
                disabled={isStreaming}
                className="w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3.5 pr-14 text-sm text-zinc-900 shadow-sm transition-all focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
              />

              <button
                type="submit"
                disabled={!inputMessage.trim() || isStreaming}
                className="absolute right-2.5 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white shadow-md shadow-teal-500/20 transition-all hover:from-teal-500 hover:to-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label="Send reflection"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            {/* Reassuring Clinical Disclaimer */}
            <p className="mt-2 text-center text-[11px] text-zinc-400 dark:text-zinc-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
              <span>
                Rewire is an AI companion for emotional reflection and coping exercises, not medical or clinical diagnosis.
              </span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
