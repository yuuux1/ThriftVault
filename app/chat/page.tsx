"use client";

import React, { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import ToastBanner from "@/components/ui/ToastBanner";

type Conversation = {
  id: number;
  buyer_id: number;
  seller_id: number;
  product_id: number;
  created_at: string;
  product_name: string;
  product_price: number;
  product_image: string | null;
  buyer_name: string;
  seller_name: string;
  last_message: string | null;
  last_message_time: string | null;
};

type Message = {
  id: number;
  conversation_id: number;
  sender_id: number;
  message_text: string;
  created_at: string;
};

export default function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const router = useRouter();
  const searchParamsUnwrapped = use(searchParams);
  const activeId = searchParamsUnwrapped.id
    ? Number(searchParamsUnwrapped.id)
    : null;

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const showNotice = (type: "success" | "error", message: string) => {
    setNotice({ type, message });
    window.setTimeout(() => setNotice(null), 2600);
  };

  // Authentication check
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      showNotice("error", "Harap login terlebih dahulu untuk mengakses chat.");
      router.push("/login");
      return;
    }
    setCurrentUser(JSON.parse(storedUser));
  }, [router]);

  // Fetch conversations list
  useEffect(() => {
    if (!currentUser) return;

    async function fetchConversations() {
      try {
        const res = await fetch(`/api/chats/conversations?userId=${currentUser.id}`);
        if (res.ok) {
          const data = await res.json();
          setConversations(data);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
      } finally {
        setLoadingConversations(false);
      }
    }

    fetchConversations();

    // Polling list percakapan setiap 6 detik
    const interval = setInterval(fetchConversations, 6000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }

    async function fetchMessages(isFirstLoad = false) {
      if (isFirstLoad) setLoadingMessages(true);
      try {
        const res = await fetch(`/api/chats/messages?conversationId=${activeId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        if (isFirstLoad) setLoadingMessages(false);
      }
    }

    fetchMessages(true);

    // Polling pesan setiap 3 detik (live chat simulation)
    const interval = setInterval(() => fetchMessages(false), 3000);
    return () => clearInterval(interval);
  }, [activeId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeId || !currentUser) return;

    const textToSend = inputText.trim();
    setInputText("");
    setSendingMessage(true);

    try {
      // Optimistic message append
      const optimisticMsg: Message = {
        id: Date.now(),
        conversation_id: activeId,
        sender_id: currentUser.id,
        message_text: textToSend,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);

      const res = await fetch("/api/chats/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: activeId,
          sender_id: currentUser.id,
          message_text: textToSend,
        }),
      });

      if (!res.ok) {
        // Rollback optimistic message if error
        showNotice("error", "Gagal mengirim pesan.");
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      } else {
        // Update conversations preview
        const conversationsRes = await fetch(
          `/api/chats/conversations?userId=${currentUser.id}`
        );
        if (conversationsRes.ok) {
          const data = await conversationsRes.json();
          setConversations(data);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const activeConv = conversations.find((c) => c.id === activeId);

  // Helper to determine other user's name
  const getOtherUserName = (conv: Conversation) => {
    if (!currentUser) return "";
    return Number(conv.buyer_id) === Number(currentUser.id)
      ? conv.seller_name
      : conv.buyer_name;
  };

  return (
    <main className="relative min-h-[calc(100vh-80px)] bg-[linear-gradient(180deg,#fff9f0_0%,#fffdf9_44%,#ffffff_100%)]">
      <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,rgba(15,156,154,0.12),transparent_40%)]" />

      <div className="mx-auto flex h-[calc(100vh-80px)] max-w-7xl gap-6 px-6 py-6 lg:px-8">
        {/* Split-pane container */}
        <div className="flex w-full overflow-hidden rounded-[2rem] border border-[rgba(15,156,154,0.14)] bg-white/85 shadow-2xl backdrop-blur-md">
          
          {/* Sidebar / Left Pane (Conversations List) */}
          <div className="flex w-full flex-col border-r border-[rgba(15,156,154,0.1)] md:w-80 lg:w-[350px] shrink-0">
            <div className="p-5 border-b border-slate-100 bg-white/50">
              <h1 className="text-xl font-bold text-[var(--thrift-ink)]">Obrolan</h1>
              <p className="text-xs text-slate-500 mt-1">Hubungi pembeli atau penjual secara real-time</p>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {loadingConversations ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--thrift-teal)] border-t-transparent"></div>
                  <span className="text-xs text-slate-400">Memuat obrolan...</span>
                </div>
              ) : conversations.length === 0 ? (
                <div className="py-20 text-center text-slate-400">
                  <p className="text-sm font-semibold">Belum Ada Chat</p>
                  <p className="text-xs mt-1 px-4 leading-relaxed">
                    Mulai obrolan dari halaman detail produk milik seller lain!
                  </p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const otherName = getOtherUserName(conv);
                  const isActive = conv.id === activeId;
                  return (
                    <Link
                      key={conv.id}
                      href={`/chat?id=${conv.id}`}
                      className={`flex items-start gap-3 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-[1px] ${
                        isActive
                          ? "bg-[rgba(15,156,154,0.1)] border border-[rgba(15,156,154,0.18)] shadow-sm"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      {/* Avatar */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--thrift-teal)] font-bold text-white text-sm">
                        {otherName.charAt(0).toUpperCase()}
                      </div>

                      {/* Preview details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="truncate text-sm font-bold text-[var(--thrift-ink)]">
                            {otherName}
                          </h4>
                          {conv.last_message_time && (
                            <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                              {new Date(conv.last_message_time).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>

                        <p className="truncate text-xs font-semibold text-[var(--thrift-teal)] mt-0.5">
                          Barang: {conv.product_name}
                        </p>

                        <p className="truncate text-xs text-slate-500 mt-1">
                          {conv.last_message || "Belum ada pesan"}
                        </p>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window / Right Pane */}
          <div className="flex flex-1 flex-col bg-slate-50/50">
            {activeId && activeConv ? (
              <>
                {/* Active Chat Header */}
                <div className="flex items-center justify-between border-b border-[rgba(15,156,154,0.08)] bg-white p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--thrift-teal)] font-bold text-white text-sm">
                      {getOtherUserName(activeConv).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[var(--thrift-ink)]">
                        {getOtherUserName(activeConv)}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-[10px] text-slate-400 font-semibold">Online</span>
                      </div>
                    </div>
                  </div>

                  {/* Product card shortcut */}
                  <Link
                    href={`/produk/${activeConv.product_id}`}
                    className="flex items-center gap-2.5 rounded-xl border border-[rgba(15,156,154,0.12)] bg-amber-50/30 p-2 hover:bg-amber-50/70 transition-all text-xs"
                  >
                    {activeConv.product_image ? (
                      <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                        <Image
                          src={activeConv.product_image}
                          alt={activeConv.product_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-8 w-8 bg-amber-100 rounded-lg shrink-0"></div>
                    )}
                    <div className="min-w-0 text-left">
                      <p className="truncate max-w-[120px] font-bold text-[var(--thrift-ink)] leading-tight">
                        {activeConv.product_name}
                      </p>
                      <p className="font-semibold text-[var(--thrift-rose)] leading-none mt-0.5">
                        Rp {Number(activeConv.product_price).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </Link>
                </div>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--thrift-teal)] border-t-transparent"></div>
                      <span className="text-xs text-slate-400">Memuat pesan...</span>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-slate-400 text-center">
                      <p className="text-sm font-semibold">Mulai Percakapan</p>
                      <p className="text-xs max-w-xs mt-1 leading-relaxed">
                        Kirim pesan pertama kamu di bawah untuk bertanya seputar produk ini!
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = Number(msg.sender_id) === Number(currentUser?.id);
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl p-3 px-4 shadow-sm text-sm ${
                              isMe
                                ? "bg-[var(--thrift-teal)] text-white rounded-tr-none"
                                : "bg-white text-[var(--thrift-ink)] border border-slate-100 rounded-tl-none"
                            }`}
                          >
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.message_text}</p>
                            <span
                              className={`block text-[9px] mt-1 text-right font-medium ${
                                isMe ? "text-teal-100" : "text-slate-400"
                              }`}
                            >
                              {new Date(msg.created_at).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input Panel */}
                <form
                  onSubmit={handleSendMessage}
                  className="flex items-center gap-3 border-t border-[rgba(15,156,154,0.08)] bg-white p-4"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Tulis pesan Anda..."
                    className="flex-1 rounded-xl border border-slate-200 p-3 text-sm focus:border-[var(--thrift-teal)] focus:outline-none focus:ring-1 focus:ring-[var(--thrift-teal)] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sendingMessage}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--thrift-teal)] text-white shadow hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-40 shrink-0"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2.5"
                      stroke="currentColor"
                      className="h-5 w-5 rotate-45 -translate-x-[2px] translate-y-[1px]"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-slate-400">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 border border-slate-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.8"
                    stroke="currentColor"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 8.511c.083.185.125.39.125.61v8.13c0 1.258-1.022 2.278-2.277 2.278H6.152c-1.256 0-2.278-1.02-2.278-2.279V9.12c0-.218.042-.423.125-.61m16.273 0c-.342-.767-1.127-1.3-2.03-1.3h-12.5c-.902 0-1.687.533-2.03 1.3m16.273 0H3.978m16.273 0h-1.3a2.278 2.278 0 00-2.278-2.279h-9c-1.258 0-2.278 1.02-2.278 2.278H3.978M15 10.125A3 3 0 119 10.125a3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[var(--thrift-ink)]">
                  Pilih Chat Terlebih Dahulu
                </h3>
                <p className="text-xs max-w-xs mt-1 leading-relaxed">
                  Silakan pilih salah satu percakapan di daftar sebelah kiri untuk mulai mengobrol seputar barang thrift.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>

      {notice && <ToastBanner variant={notice.type} message={notice.message} />}
  );
}
