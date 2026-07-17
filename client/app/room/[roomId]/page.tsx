"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { getSocket } from "@/lib/socket";

interface ChatMessage {
  username: string;
  text: string;
  ts: number;
}

export default function RoomPage() {
  const params = useParams<{ roomId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = params.roomId;
  const username = searchParams.get("username") || "anonymous";

  const [members, setMembers] = useState<string[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const socket = getSocket();

    socket.emit("join-room", { roomId, username });

    function handleMembers(list: string[]) {
      setMembers(list);
    }

    function handleMessage(msg: ChatMessage) {
      setMessages((prev) => [...prev, msg]);
    }

    function handleJoinError({ message }: { message: string }) {
      setJoinError(message);
      setTimeout(() => router.push("/"), 2000);
    }

    socket.on("room-members", handleMembers);
    socket.on("chat-message", handleMessage);
    socket.on("join-error", handleJoinError);

    return () => {
      socket.off("room-members", handleMembers);
      socket.off("chat-message", handleMessage);
      socket.off("join-error", handleJoinError);
    };
  }, [roomId, username, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    const socket = getSocket();
    socket.emit("chat-message", { roomId, username, text: input });
    setInput("");
  }

  function formatTime(ts: number) {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (joinError) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">{joinError} — redirecting…</p>
      </div>
    );
  }

  return (
    <div className="h-screen max-w-xl mx-auto flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-3 sticky top-0 bg-white flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Room</p>
          <p className="text-sm font-mono tracking-wide">{roomId}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Members</p>
          <p className="text-sm text-gray-700">{members.join(", ") || "—"}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-10">No messages yet</p>
        )}

        {messages.map((message, index) => {
          const isSelf = message.username === username;
          return (
            <div key={index} className={`flex flex-col ${isSelf ? "items-end" : "items-start"}`}>
              {!isSelf && (
                <span className="text-xs text-gray-400 mb-1 px-1">{message.username}</span>
              )}
              <div
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                  isSelf
                    ? "bg-black text-white rounded-br-sm"
                    : "bg-gray-100 text-gray-900 rounded-bl-sm"
                }`}
              >
                {message.text}
              </div>
              <span className="text-[11px] text-gray-300 mt-1 px-1">{formatTime(message.ts)}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-3 py-5 flex gap-2 sticky bottom-0 ">
        <input
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-gray-400 transition-colors text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] transition-all cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}