"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSocket } from "../lib/socket";
import ThemeToggle from "@/components/theme-toggle";

export default function App() {
  const [username, setUsername] = useState("");
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  function handleGenerate() {
    if (!username.trim()) return setError("Enter your name first");
    setError("");
    setCreating(true);
    const socket = getSocket();
    socket.emit("create-room");
    socket.once("room-created", ({ roomId }: { roomId: string }) => {
      router.push(`/room/${roomId}?username=${encodeURIComponent(username)}`);
    });
  }

  function handleJoin() {
    if (!username.trim() || !roomIdInput.trim()) return setError("Enter your name and a room code");
    setError("");
    router.push(`/room/${roomIdInput}?username=${encodeURIComponent(username)}`);
  }

  return (
    <div className="h-screen bg-white dark:bg-black dark:text-white ">

      <div className="h-screen max-w-xl mx-auto flex items-center justify-center px-4">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">Chat</h1>
            <p className="text-sm text-gray-500">No signup.&nbsp; No history.&nbsp; Just chat.</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Your name
              </label>
              <input
                className="w-full px-3.5 py-2.5 rounded-lg border placeholder:text-gray-500 border-gray-400 outline-none focus:border-gray-400 transition-colors"
                placeholder="e.g. alice"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div> 

            <button
              disabled={creating}
              onClick={handleGenerate}
              className="w-full px-4 py-2.5 rounded-lg bg-black dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white text-sm font-medium hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {creating ? "Creating…" : "Start a new room"}
            </button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or join one</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <div className="flex gap-2">
              <input
                className="flex-1 min-w-0 px-3.5 py-2.5 placeholder:text-gray-500 rounded-lg border border-gray-400 outline-none focus:border-gray-400 transition-colors"
                placeholder="room code"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
              />
              <button
                onClick={handleJoin}
                className="px-4 py-2.5 rounded-lg bg-black text-white hover:bg-gray-900 border border-gray-300 text-sm font-medium dark:text-black dark:bg-white dark:hover:bg-gray-200  hover:border-gray-400 disabled:opacity-50 transition-all cursor-pointer"
              >
                Join
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
      <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}